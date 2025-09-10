from flask import Blueprint, jsonify, current_app, request
from . import db
from .models import URL

main = Blueprint("main", __name__)


@main.route("/")
def home():
    return jsonify({"message": "Welcome to NanoLink API <3"}), 200


@main.route("/shorten", methods=["Post"])
def shorten_url():
    data = request.get_json()
    original_url = data.get("url")

    if not original_url:
        return jsonify({"error": "URL is required"}), 400

    new_url = URL(original_url=original_url)
    db.session.add(new_url)
    db.session.commit()

    short_url = f"http://localhost:5000/{new_url.short_code}"
    return jsonify({"short_url": short_url}), 201

@main.route("/expand/<short_code>", methods=["GET"])
def expand_url(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first()
    if url_entry:
        return jsonify({"original_url": url_entry.original_url}), 200
    else:
        return jsonify({"error": "Short code not found"}), 404
