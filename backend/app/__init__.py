from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # CORS support
    CORS(app)
    
    # Database config
    database_url = os.getenv("DATABASE_URL")
    
    if os.getenv('TESTING') == 'true':
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["TESTING"] = True
    else:
        database_url = os.getenv("DATABASE_URL", "sqlite:///app.db")
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    
    db.init_app(app)
    
    # Imports models so tables are created
    from . import models
    with app.app_context():
        db.create_all()
    
    # Register routes
    from .routes import main
    app.register_blueprint(main)
    
    return app