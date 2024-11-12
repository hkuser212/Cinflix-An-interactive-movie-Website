from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os
from dotenv import load_dotenv

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'routes.signup'
login_manager.login_message_category = 'info'
DB_NAME = "site.db"

def create_app():
    app = Flask(__name__)
    load_dotenv()

    app.config['SECRET_KEY'] = 'hadewjfc3w212'  # Make sure to use a secure random key in production
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['TMDB_API_KEY'] = os.getenv('TMDB_API_KEY')
    app.config['TMDB_BASE_URL'] = os.getenv('TMDB_BASE_URL')
    from .model import User,Movie
    from .routes import routes
    app.register_blueprint(routes)

    # Initialize extensions with the app instance
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
       
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    # Create the database if it doesn't exist
    with app.app_context():
        create_database()

    return app

def create_database():
    
    if not os.path.exists(DB_NAME):
            db.create_all()
    print('Created Database!')

