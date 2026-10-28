import uuid
import requests

BASE = "http://localhost:5000"
AUTH = BASE + "/api/auth"   # change this to your real prefix


def new_user():
    """Makes a unique user each run so tests never clash."""
    tag = uuid.uuid4().hex[:8]
    return {
        "username": f"test_{tag}",
        "email": f"test_{tag}@example.com",
        "password": "Test@123",
    }


def test_health_check():
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 200


def test_register_valid_user():
    r = requests.post(f"{AUTH}/register", json=new_user())
    assert r.status_code == 201
    assert "token" in r.json()


def test_register_missing_fields():
    r = requests.post(f"{AUTH}/register", json={"email": "a@b.com"})
    assert r.status_code == 400


def test_register_invalid_email():
    user = new_user()
    user["email"] = "notanemail"
    r = requests.post(f"{AUTH}/register", json=user)
    assert r.status_code == 400


def test_register_short_password():
    user = new_user()
    user["password"] = "123"
    r = requests.post(f"{AUTH}/register", json=user)
    assert r.status_code == 400


def test_register_duplicate_email():
    user = new_user()
    requests.post(f"{AUTH}/register", json=user)
    r = requests.post(f"{AUTH}/register", json=user)
    assert r.status_code == 400


def test_login_valid():
    user = new_user()
    requests.post(f"{AUTH}/register", json=user)
    r = requests.post(f"{AUTH}/login", json={"email": user["email"], "password": user["password"]})
    assert r.status_code == 200
    assert "token" in r.json()


def test_login_wrong_password():
    user = new_user()
    requests.post(f"{AUTH}/register", json=user)
    r = requests.post(f"{AUTH}/login", json={"email": user["email"], "password": "wrongpass"})
    assert r.status_code == 401


def test_login_missing_password():
    r = requests.post(f"{AUTH}/login", json={"email": "a@b.com"})
    assert r.status_code == 400