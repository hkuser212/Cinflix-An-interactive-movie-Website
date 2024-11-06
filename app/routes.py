from flask import Blueprint,render_template, request, redirect, url_for, flash
from app.model import db, User,Movie
from app import db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required

routes = Blueprint('routes', __name__)


@routes.route('/')
def landing():
    return render_template('landing.html')

@routes.route('/about')
def about():
    return render_template('about.html')

@routes.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

     
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email is already registered. Please log in or use a different email.', 'danger')
            return redirect(url_for('routes.signup'))
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username, email=email, password=hashed_password)

        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('routes.signin'))  # Redirect to the signin page after signup

    return render_template('signup.html')
@routes.route("/signin", methods=['GET', 'POST'])
def signin():
    if current_user.is_authenticated:
        return redirect(url_for('routes.home'))
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        remember = True if request.form.get('remember') else False

        user = User.query.filter_by(email=email).first()

        # Check if the user exists and the password matches
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=True)
            
            return redirect(url_for('routes.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
            return redirect(url_for('routes.signin'))  # Stay on sign-in page after failure

    # Render the sign-in page
    return render_template('signin.html')

@routes.route('/signout')
@login_required
def signout():
    logout_user()  # Assuming you have a logout_user function
    return redirect(url_for('routes.home'))  # Redirect to home or wherever
@routes.route('/movies')
def movies():
    return render_template('movie.html')

@routes.route('/tvshows')
def tvshows():
    return render_template('tvshows.html')
@routes.route('/animes')
def animes():
    return render_template('animes.html')

@routes.route("/search", methods=["GET", "POST"])
def search():
    search_term = request.form.get('search')
    results = Movie.query.filter(
        (Movie.title.ilike(f"%{search_term}%")) |
        (Movie.genre.ilike(f"%{search_term}%")) |
        (Movie.description.ilike(f"%{search_term}%"))
    ).all()
    return render_template('search_results.html', results=results, search_term=search_term)


@routes.route('/home')
def home():
    return render_template('home.html')