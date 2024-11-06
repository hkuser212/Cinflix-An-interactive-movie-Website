from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from app import db,login_manager
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"
    
class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    release_date = db.Column(db.Date, nullable=True)
    description = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String(255), nullable=False)  # URL or file path of the video
    thumbnail_url = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<Movie {self.title}>"
    
