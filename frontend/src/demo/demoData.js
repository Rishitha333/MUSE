// Pre-computed sample data used by Demo Mode.
// These are real outputs from the MUSE pipeline on scripted test recordings.
// Shapes match what the Flask backend returns, so no page needs to change.

export const DEMO_TOKEN = "demo-token";

export const DEMO_USER = {
  _id: "demo000000000000000000001",
  email: "demo@muse.com",
  username: "Demo User",
  role: "user",
};

// Newest first, like the real History endpoint
export const DEMO_CALLS = [
  {
    _id: "6a0000000000000000000a01",
    call_id: "CR261001-150108-6675",
    timestamp: "2026-10-01T15:01:50+05:30",
    detected_language: "English",
    target_language: "Malayalam",
    input: { source_lang: "English", target_lang: "Malayalam" },
    transcript:
      "Hello, my name is Jessica Brown. I'd like to place an order. I want to order one OV1357 oven and one MW8642 microwave. Could you please tell me the total cost including shipping and the estimated delivery date? Also, I'd like to pay with visa. My card number is dot, dot, dot.",
    translated_transcript:
      "ഹലോ, എന്റെ പേര് ജെസീക്ക ബ്രൌൺ. എനിക്ക് ഒരു ഓർഡർ നൽകണം. എനിക്ക് ഒരു ഒവി 1357 ഓവൻ, ഒരു എം. വൈ. 8642 മൈക്രോവേവ് ഓർഡർ ചെയ്യണം. ഷിപ്പിംഗും കണക്കാക്കിയ ഡെലിവറി തീയതിയും ഉൾപ്പെടെയുള്ള മൊത്തം ചെലവ് പറയാമോ? കൂടാതെ, എനിക്ക് വിസ ഉപയോഗിച്ച് പണം നൽകണം. എന്റെ കാർഡ് നമ്പർ ഡോട്ട്, ഡോട്ട്, ഡോട്ട് ആണ്.",
    text: { sentiment: "Neutral" },
    audio: { tone: "Tense" },
    results: {
      final_sarcasm_score: 0.4,
      stt_confidence: 1.0,
      translation_confidence: 0.95,
    },
  },
  {
    _id: "6a0000000000000000000a02",
    call_id: "CR261001-145036-4219",
    timestamp: "2026-10-01T14:51:30+05:30",
    detected_language: "English",
    target_language: "Telugu",
    input: { source_lang: "English", target_lang: "Telugu" },
    transcript:
      "I am extremely dissatisfied with my recent order. I am John Davis and I'm calling about order number 123456. The FR-40401 refrigerator arrived yesterday and it's damaged. There's a huge dent on the side and it's not cooling properly. I want to know what you're going to do about this. I demand the replacement and I want it delivered as soon as possible. I've been without a working refrigerator for two days now.",
    translated_transcript:
      "నేను నా ఇటీవలి ఆర్డర్తో చాలా అసంతృప్తి చెందాను. నేను జాన్ డేవిస్ మరియు నేను ఆర్డర్ నంబర్ 123456 గురించి పిలుస్తున్నాను. FR-40401 రిఫ్రిజిరేటర్ నిన్న వచ్చింది మరియు అది దెబ్బతింది. వైపున భారీ ముక్క ఉంది మరియు ఇది సరిగా శీతలీకరించడం లేదు. మీరు దీని గురించి ఏమి చేయబోతున్నారో తెలుసుకోవాలనుకుంటున్నాను. నేను భర్తీని డిమాండ్ చేస్తున్నాను మరియు వీలైనంత త్వరగా పంపిణీ చేయాలనుకుంటున్నాను. నేను రెండు రోజులుగా పని చేసే రిఫ్రిజిరేటర్ లేకుండా ఉన్నాను.",
    text: { sentiment: "Negative" },
    audio: { tone: "Frustrated" },
    results: {
      final_sarcasm_score: 0.444,
      stt_confidence: 1.0,
      translation_confidence: 0.95,
    },
  },
  {
    _id: "6a0000000000000000000a03",
    call_id: "CR261001-142248-8965",
    timestamp: "2026-10-01T14:23:51+05:30",
    detected_language: "English",
    target_language: "Hindi",
    input: { source_lang: "English", target_lang: "Hindi" },
    transcript:
      "Hello, I'm Sarah Miller. I'm calling to inquire about the AC-7892 air conditioner unit. I saw it on your website and I had a few questions. First, what's the BTU rating? And second, does it come with a remote control or is that sold separately?",
    translated_transcript:
      "हैलो, मैं सारा मिलर हूँ. मैं AC-7892 एयर कंडीशनर यूनिट के बारे में पूछताछ करने के लिए कॉल कर रहा हूँ. मैंने इसे आपकी वेबसाइट पर देखा और मुझे कुछ सवाल थे. पहले, BTU रेटिंग क्या है? और दूसरा, क्या यह एक रिमोट कंट्रोल के साथ आता है या यह अलग से बेचा जाता है?",
    text: { sentiment: "Neutral" },
    audio: { tone: "Tense" },
    results: {
      final_sarcasm_score: 0.367,
      stt_confidence: 0.99,
      translation_confidence: 0.95,
    },
  },
  {
    _id: "6a0000000000000000000a04",
    call_id: "CR260820-224822-3236",
    timestamp: "2026-08-20T22:49:18+05:30",
    detected_language: "English",
    target_language: "Telugu",
    input: { source_lang: "English", target_lang: "Telugu" },
    transcript:
      "I just wanted to call and say how pleased I am with the DW 6543 dishwasher I purchased last month. My name is Robert Smith and the order number is 246801. It's incredibly quiet and it cleans the dishes perfectly. It's the best dishwasher I've ever owned. The delivery was also very smooth. Thank you for providing such a great product and service.",
    translated_transcript:
      "నేను ఫోన్ చేసి, నేను గత నెలలో కొనుగోలు చేసిన DW 6543 డిష్వాషర్తో ఎంత సంతోషంగా ఉన్నానో చెప్పాలనుకున్నాను. నా పేరు రాబర్ట్ స్మిత్ మరియు ఆర్డర్ నంబర్ 246801. ఇది చాలా నిశ్శబ్దంగా ఉంది మరియు ఇది డిష్లను ఖచ్చితంగా శుభ్రపరుస్తుంది. ఇది నేను కలిగి ఉన్న ఉత్తమ డిష్వాషర్. డెలివరీ కూడా చాలా మృదువైనది. అటువంటి గొప్ప ఉత్పత్తి మరియు సేవను అందించినందుకు ధన్యవాదాలు.",
    text: { sentiment: "Positive" },
    audio: { tone: "Energetic" },
    results: {
      final_sarcasm_score: 0.309,
      stt_confidence: 1.0,
      translation_confidence: 0.95,
    },
  },
];

// Same shape as getHistoryStats() returns
export const getDemoStats = () => {
  const n = DEMO_CALLS.length;
  const avg = (pick) => DEMO_CALLS.reduce((sum, c) => sum + pick(c), 0) / n;
  return {
    total_analyses: n,
    avg_stt_confidence: avg((c) => c.results.stt_confidence),
    avg_translation_confidence: avg((c) => c.results.translation_confidence),
    avg_sarcasm_score: avg((c) => c.results.final_sarcasm_score),
  };
};

// Converts a sample call into the navigation state that Results.jsx reads
export const toResultsState = (call) => ({
  callId: call.call_id,
  transcript: call.transcript,
  translatedTranscript: call.translated_transcript,
  finalSarcasmScore: call.results.final_sarcasm_score,
  tone: call.audio.tone,
  sentiment: call.text.sentiment,
  sttConfidence: call.results.stt_confidence,
  translationConfidence: call.results.translation_confidence,
  targetLang: call.target_language,
  sourceLang: call.detected_language,
});