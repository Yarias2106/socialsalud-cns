from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_headers(username="worker1", password="pass1234"):
    client.post("/api/auth/register", json={"username": username, "password": password})
    res = client.post("/api/auth/login", data={"username": username, "password": password})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_card():
    headers = get_auth_headers()
    res = client.post("/api/cards/", json={"mat_aseg": "A-001", "nombre": "Juan", "apellido_paterno": "Pérez"}, headers=headers)
    assert res.status_code == 201
    assert res.json()["mat_aseg"] == "A-001"


def test_list_cards():
    headers = get_auth_headers()
    client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers)
    client.post("/api/cards/", json={"mat_aseg": "B-002"}, headers=headers)
    res = client.get("/api/cards/", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_search_by_mat_aseg():
    headers = get_auth_headers()
    client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers)
    client.post("/api/cards/", json={"mat_aseg": "B-002"}, headers=headers)
    res = client.get("/api/cards/?search=A-001", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_card():
    headers = get_auth_headers()
    created = client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers).json()
    res = client.get(f"/api/cards/{created['id']}", headers=headers)
    assert res.status_code == 200


def test_update_card():
    headers = get_auth_headers()
    created = client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers).json()
    res = client.put(f"/api/cards/{created['id']}", json={"nombre": "Carlos"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["nombre"] == "Carlos"


def test_delete_card():
    headers = get_auth_headers()
    created = client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers).json()
    res = client.delete(f"/api/cards/{created['id']}", headers=headers)
    assert res.status_code == 204


def test_other_user_cannot_access_card():
    headers1 = get_auth_headers("user1", "pass1234")
    headers2 = get_auth_headers("user2", "pass5678")
    created = client.post("/api/cards/", json={"mat_aseg": "PRIV-001"}, headers=headers1).json()
    res = client.get(f"/api/cards/{created['id']}", headers=headers2)
    assert res.status_code == 404


def test_add_observation():
    headers = get_auth_headers()
    card = client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers).json()
    res = client.post(f"/api/cards/{card['id']}/observations",
                      json={"texto": "Paciente presenta mejoría", "fecha_visita": "2024-03-15"},
                      headers=headers)
    assert res.status_code == 201
    assert res.json()["texto"] == "Paciente presenta mejoría"


def test_delete_observation():
    headers = get_auth_headers()
    card = client.post("/api/cards/", json={"mat_aseg": "A-001"}, headers=headers).json()
    obs = client.post(f"/api/cards/{card['id']}/observations",
                      json={"texto": "Visita inicial", "fecha_visita": "2024-03-15"},
                      headers=headers).json()
    res = client.delete(f"/api/cards/{card['id']}/observations/{obs['id']}", headers=headers)
    assert res.status_code == 204
