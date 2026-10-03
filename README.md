# MUSE — Multimodal Sentiment & Sarcasm Intelligence System

**Beyond words into emotions**

Speech analysis for languages where "fine" rarely means fine.

MUSE takes an audio recording or a piece of text, works out what was said, what was meant, and whether the two agree. It transcribes speech, translates across seven languages, classifies sentiment, and detects sarcasm by reading the words and the voice against each other.

## Live demo

**[muse-project-xi.vercel.app](https://muse-project-xi.vercel.app)** — click **Try Demo** to explore the dashboard, history, PDF export, and four real pipeline outputs across Hindi, Telugu, and Malayalam.

> The public demo shows pre-computed results produced by the real pipeline. Live audio analysis runs five transformer models and needs several GB of RAM, which free hosting tiers can't provide, so it runs locally. See [Running it](#running-it).

## Results

| Task | Model | Accuracy |
|---|---|---|
| Sarcasm detection | mBERT embeddings + Logistic Regression | **93.36%** (held-out test set, n = TEST_SET_SIZE) |
| Sentiment classification | RoBERTa (`cardiffnlp/twitter-roberta-base-sentiment`) | **86.29%** |

**Research paper:** *"Cross Talk Sentiment: A Multi-Modal Approach for Sarcasm Detection in Customer Segment"*, presented at ICICTA 2026.

## The problem

Sentiment analysis is largely solved for plain statements. It falls apart on sarcasm, because sarcasm is a disagreement between signals: the words carry one meaning and the delivery carries the opposite. Read the transcript alone and *"brilliant, another delay"* looks positive.

That gets harder in a multilingual setting. A call centre in India might receive Tamil, Telugu, Hindi, Kannada, Malayalam, and Marathi in the same afternoon, and a model trained on English tweets has nothing useful to say about any of them.

MUSE takes both problems seriously:

- **Two signals, read separately, then fused.** Text sarcasm probability comes from mBERT embeddings and a trained classifier. Tone comes from pitch and energy features extracted with Librosa. They are combined by weighted late fusion.
- **Seven languages, routed to the right model.** Speech is transcribed with Whisper, then translated by NLLB-200 or Marian depending on the language pair.

## Pipeline

```
   audio file                          raw text
       │                                   │
       ▼                                   │
┌───────────────┐                          │
│   Whisper     │  transcribe + detect lang│
│ faster-whisper│                          │
└──────┬────────┘                          │
       │                                   │
       ├───────────────┬───────────────────┘
       ▼               ▼
┌─────────────┐  ┌──────────────┐
│  Librosa    │  │ Translation  │  NLLB-200 / Marian
│ pitch,      │  │ router       │
│ energy,     │  └──────┬───────┘
│ MFCC        │         │
└──────┬──────┘         ├────────────────┐
       │                ▼                ▼
       │        ┌───────────────┐ ┌─────────────┐
       │        │ mBERT + LR    │ │  RoBERTa    │
       │        │ sarcasm prob. │ │  sentiment  │
       │        └───────┬───────┘ └──────┬──────┘
       │                │                │
       ▼                ▼                │
   ┌─────────────────────────┐           │
   │   Late fusion           │           │
   │   0.6·text + 0.4·audio  │           │
   └───────────┬─────────────┘           │
               │                         │
               ▼                         ▼
        ┌────────────────────────────────────┐
        │  MongoDB — analysis history        │
        └────────────────────────────────────┘
```

## What it does

**Speech to text.** `faster-whisper` transcribes uploaded audio and detects the source language automatically. Supports wav, mp3, m4a, ogg, flac, and aac.

**Translation.** A router picks the model per language pair: NLLB-200 (distilled 600M) for Indian languages, Marian for common European pairs. Supported: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi.

**Sentiment.** `cardiffnlp/twitter-roberta-base-sentiment` classifies positive, neutral, or negative with a confidence score.

**Sarcasm.** mBERT (`bert-base-multilingual-cased`) produces a CLS embedding for the text; a logistic regression classifier trained on that embedding space returns a sarcasm probability. The tone score from Librosa is derived from mean pitch and RMS energy. The two are fused as `0.6 × text + 0.4 × audio`.

**Persistence and history.** Every analysis is stored per user with its transcript, translation, scores, and detected language. Users see their own history; administrators see everything.

**Admin panel.** System-wide statistics, all call records, sentiment and language distribution charts, user administration with role and status control, and an activity log recording real administrative events.

**Auth.** JWT tokens with a 24-hour expiry, passwords hashed with bcrypt at cost 12, and role-based access control separating users from administrators.

**PDF export** of analysis results, with embedded Noto fonts so Devanagari, Tamil, Telugu, Kannada, and Malayalam render correctly rather than as boxes.

## Tech stack

| Layer | Built with |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Framer Motion, jsPDF |
| API | Flask, Flask-CORS |
| Speech | faster-whisper |
| Translation | NLLB-200 distilled 600M, MarianMT |
| Sentiment | RoBERTa (`cardiffnlp/twitter-roberta-base-sentiment`) |
| Sarcasm | mBERT embeddings + scikit-learn LogisticRegression |
| Audio features | Librosa (pitch, RMS energy, MFCC) |
| Database | MongoDB (PyMongo) |
| Auth | PyJWT, bcrypt |
| Hosting (demo) | Vercel |

## Running it

### Requirements

- Python 3.10 or 3.11 (3.12+ has dependency issues; 3.10 is best tested)
- Node.js 18+
- MongoDB running locally
- 8 GB RAM recommended: all models load into memory at startup
- About 4 GB free disk for the models, downloaded automatically on first run
- `ffmpeg` on your PATH (recommended; needed to decode some formats such as m4a/aac)

### 1. Clone and configure

```bash
git clone https://github.com/Rishitha333/Muse_project.git
cd Muse_project/backend
cp .env.example .env
```

Open `.env` and set `JWT_SECRET` to a long random string. The app refuses to start without it, by design. Set the MongoDB connection string there too if yours isn't the local default.

### 2. Backend

```bash
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

# No GPU? Install the CPU build of PyTorch first (avoids a multi-GB CUDA download):
pip install torch --index-url https://download.pytorch.org/whl/cpu

pip install -r requirements.txt
python create_all_users.py     # seeds demo accounts
python app.py
```

Runs on `http://127.0.0.1:5000`. First start downloads Whisper, mBERT, RoBERTa, and NLLB, so expect several minutes and a few GB. The trained sarcasm classifier (`backend/models/sarcasm_classifier.pkl`) is included in the repository, so no training is needed to run the app.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. By default the frontend talks to `http://127.0.0.1:5000`. To point it elsewhere, create `frontend/.env` with `VITE_API_URL=https://your-backend-url`.

### Demo accounts (local development only)

These accounts are created by `create_all_users.py` on your own machine. They are for local testing only; never reuse these credentials in a deployed environment.

| Role | Email | Password |
|---|---|---|
| User | `test@muse.com` | `test123` |

To create an administrator, set a user's `role` field to `admin` in MongoDB, then sign in again. The role is carried in the JWT, so an existing session keeps the old one.

## Demo mode (how the public site works)

The hosted demo is the same frontend built with `VITE_DEMO_MODE=true`. In that mode:

- `src/services/api.js` returns the pre-computed samples in `src/demo/demoData.js` instead of calling a server.
- The login page offers **Try Demo**, and the Analyze page offers four sample calls.
- Live audio upload, registration, profile edits, and the admin panel are disabled.

Leave `VITE_DEMO_MODE` unset (the default) for the full application.

## Retraining the sarcasm classifier (optional)

The trained classifier ships with the repository. To reproduce it:

```bash
# 1. Obtain the dataset (see data/README.md) and place it at
#    data/sarcasm_dataset.csv

# 2. Generate mBERT embeddings
python training/generate_text_embeddings.py

# 3. Train the classifier
python training/train_sarcasm_classifier.py
```

This writes `backend/models/sarcasm_classifier.pkl`, which the API loads at startup. The evaluation scripts in `backend/evaluation/` produce confusion matrices and sentiment-vs-sarcasm scatter plots; their dependencies are already in `requirements.txt`.

The pickle must be loaded with the same scikit-learn version that created it, which is why `requirements.txt` pins that package.

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/analyze` | optional | Analyse audio and/or text |
| GET | `/health` | none | Health check |
| POST | `/api/auth/register` | none | Create an account |
| POST | `/api/auth/login` | none | Obtain a JWT |
| GET | `/api/auth/me` | user | Current user |
| GET | `/api/history/list` | user | Own analysis history |
| GET | `/api/history/stats` | user | Own statistics |
| DELETE | `/api/history/<id>` | user | Delete own analysis |
| GET | `/api/admin/stats` | admin | System-wide statistics |
| GET | `/api/admin/users` | admin | All users with usage counts |
| PUT | `/api/admin/users/<id>/role` | admin | Change a role |
| PUT | `/api/admin/users/<id>/status` | admin | Activate / deactivate |
| GET | `/api/admin/calls` | admin | All analyses, paginated |
| GET | `/api/admin/activity` | admin | Administrative activity log |

## Project layout

```
backend/
  app.py                    Flask app, /analyze orchestration
  speech_to_text/           Whisper transcription
  translation/              NLLB, Marian, and the routing logic
  text_processing/          sentiment and sarcasm inference
  audio_processing/         Librosa feature extraction, tone score
  fusion/                   late fusion of text and audio signals
  auth/                     JWT generation and route decorators
  database/                 MongoDB config and models
  routes/                   auth, history, and admin blueprints
  evaluation/               training and evaluation scripts
  models/                   trained sarcasm classifier
frontend/
  src/pages/                user-facing screens
  src/pages/admin/          admin panel
  src/services/api.js       API client (with demo-mode switch)
  src/demo/demoData.js      pre-computed sample calls for the public demo
  public/fonts/             Noto fonts for Indic PDF export
training/                   embedding generation and classifier training
data/                       dataset instructions (data not committed)
```

## Design decisions and limitations

Being straightforward about what is and is not finished.

- **mBERT is used as a frozen feature extractor, not fine-tuned.** With roughly 3,400 labelled examples, fine-tuning a 178M-parameter model would overfit. Extracting CLS embeddings and training a linear classifier on top is a stronger baseline at this data scale, and it trains in seconds rather than hours.
- **The fusion weight (0.6 text / 0.4 audio) was chosen, not learned.** Text is the stronger signal, so it carries more weight, but the exact split has not been tuned against a validation set. That is the next experiment worth running.
- **The audio tone score is a heuristic**, normalising mean pitch and RMS energy into a 0–1 range. MFCCs are extracted but not yet used in the tone score.
- **Scripted test recordings.** The sample calls in the public demo come from scripted recordings, not real customer calls, so no personal data is involved.
- **No streaming.** Audio is processed after upload, not in real time.
- **Models load into memory at import**, so the first request after startup is slow and memory use is high. Lazy loading would help.
- **Free hosting can't run the full pipeline.** Whisper, NLLB-200, mBERT, and RoBERTa together need several GB of RAM, so the public site uses demo mode and the live pipeline runs locally.

## Roadmap

- [ ] Tune the fusion weight against a validation set
- [ ] Use MFCC features in the tone model rather than pitch and energy alone
- [ ] Fine-tune mBERT once more labelled data is available
- [ ] Lazy model loading and a smaller Whisper variant for faster cold starts
- [ ] Real-time streaming analysis
- [ ] Docker Compose for one-command setup
- [ ] Hosted live backend for the public demo

## Licence

The code in this repository is MIT licensed — see [LICENSE](LICENSE).

Models downloaded at runtime carry their own licences. Note that NLLB-200 is released under CC-BY-NC, which restricts commercial use; swap the translation model before any commercial deployment.

---

Built by **Rishitha Galicherla** · [GitHub](https://github.com/Rishitha333) · [LinkedIn](https://www.linkedin.com/in/)
