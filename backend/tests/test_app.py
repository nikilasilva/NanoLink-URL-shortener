import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.testing = True
    with app.test_client() as client:
        yield client
        
def test_dummy(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json() == {"message": "Welcome to NanoLink API <3"}