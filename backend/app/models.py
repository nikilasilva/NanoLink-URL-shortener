from . import db
import string
import random


class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_code = db.Column(db.String(6), unique=True, nullable=False)

    def __init__(self, original_url):
        self.original_url = original_url
        self.short_code = self.generate_short_code()

    def generate_short_code(self, length=6):
        chars = string.ascii_letters + string.digits
        return "".join(random.choice(chars) for _ in range(length))
