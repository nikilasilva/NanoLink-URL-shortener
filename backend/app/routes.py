from flask import Blueprint, jsonify, request, redirect
from . import db
from .models import URL
import os

main = Blueprint("main", __name__)


# Add to routes.py temporarily
@main.route("/debug/info")
def debug_info():
    import socket
    return jsonify({
        "hostname": socket.gethostname(),
        "base_url": os.getenv("BASE_URL", "NOT SET"),
        "database_url": os.getenv("DATABASE_URL", "NOT SET")[:50] + "..."
    }), 200


@main.route("/")
def home():
    return jsonify({"message": "Welcome to NanoLink API <3"}), 200


@main.route("/shorten", methods=["POST"])
def shorten_url():
    data = request.get_json()
    original_url = data.get("url")

    if not original_url:
        return jsonify({"error": "URL is required"}), 400

    # Add protocol if missing
    if not original_url.startswith(('http://', 'https://')):
        original_url = "https://" + original_url

    new_url = URL(original_url=original_url)
    db.session.add(new_url)
    db.session.commit()

    base_url = os.getenv("BASE_URL", "http://localhost:5000")
    short_url = f"{base_url}/{new_url.short_code}"
    return jsonify({"short_url": short_url}), 201


@main.route("/expand/<short_code>", methods=["GET"])
def expand_url(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first()
    if url_entry:
        return jsonify({"original_url": url_entry.original_url}), 200
    else:
        return jsonify({"error": "Short code not found"}), 404


@main.route("/<short_code>", methods=["GET"])
def redirect_to_original(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first()
    if url_entry:
        return redirect(url_entry.original_url)
    else:
        return jsonify({"error": "Short code not found"}), 404
