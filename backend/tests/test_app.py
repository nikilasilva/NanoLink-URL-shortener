import os
import pytest
from app import create_app, db


@pytest.fixture
def client():
    os.environ["TESTING"] = "true"
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///:memory:"  # use in-memory DB for tests
    )

    with app.app_context():
        db.create_all()

    with app.test_client() as client:
        yield client

    with app.app_context():
        db.drop_all()

    os.environ.pop("TESTING", None)


def test_dummy(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json() == {"message": "Welcome to NanoLink API <3"}


def test_shorten_url(client):
    response = client.post(
        "/shorten",
        json={
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
        },
    )
    assert response.status_code == 201
    data = response.get_json()
    assert "short_url" in data
    assert data["short_url"].startswith("http://")
