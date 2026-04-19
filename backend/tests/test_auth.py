from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_success():
    res = client.post("/api/auth/register", json={"username": "testuser", "password": "secret123"})
    assert res.status_code == 201
    assert res.json()["username"] == "testuser"


def test_register_duplicate_username():
    client.post("/api/auth/register", json={"username": "testuser", "password": "secret123"})
    res = client.post("/api/auth/register", json={"username": "testuser", "password": "otrapass"})
    assert res.status_code == 400


def test_register_short_password():
    res = client.post("/api/auth/register", json={"username": "nuevo", "password": "abc"})
    assert res.status_code == 400


def test_login_success():
    client.post("/api/auth/register", json={"username": "testuser", "password": "secret123"})
    res = client.post("/api/auth/login", data={"username": "testuser", "password": "secret123"})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password():
    client.post("/api/auth/register", json={"username": "testuser", "password": "secret123"})
    res = client.post("/api/auth/login", data={"username": "testuser", "password": "wrongpass"})
    assert res.status_code == 401


def test_login_nonexistent_user():
    res = client.post("/api/auth/login", data={"username": "noexiste", "password": "pass123"})
    assert res.status_code == 401
