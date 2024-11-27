from flask import Blueprint,render_template, request, redirect, url_for, flash,current_app,jsonify
from app.model import db, User,Movie
from app import db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required
from app.tmdb import search_movies,get_tmdb_data,fetch_genres,fetch_movie_by_genres,get_movie_details,get_tv_show_details,get_movies,get_tv_shows,get_top_rated_movies
routes = Blueprint('routes', __name__)


@routes.route('/')
def landing():
    return render_template('landing.html')
@routes.route('/genres2')
def genres2():
    return render_template('genres2.html')

@routes.route('/api/genres',methods=['GET'])
def genres():
    genres = fetch_genres()
    return jsonify(genres)
@routes.route('/api/movies2',methods=['POST'])
def movies2():
    data = request.get_json()
    genre_ids = data.get('genres', [])
    page = data.get('page', 1)
    movies = fetch_movie_by_genres(genre_ids, page)
    return jsonify(movies)

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
@routes.route('/movie')
def movie():
    trending_movies = get_tmdb_data('/trending/movie/day')
    top_rated_movies = get_tmdb_data('/movie/top_rated')
    upcoming_movies = get_tmdb_data('/movie/upcoming')
    return render_template('movie.html',top_rated_movies=top_rated_movies['results'],upcoming_movies=upcoming_movies['results'],trending_movies=trending_movies['results'])

@routes.route('/tvshows')
def tvshows():
    
    trending_tv_shows = get_tmdb_data('/trending/tv/day')
    upcoming_tv_shows = get_tmdb_data('/tv/on_the_air')
    top_rated_tv_shows = get_tmdb_data('/tv/top_rated')
    return render_template('tvshows.html',trending_tv_shows=trending_tv_shows['results'],upcoming_tv_shows=upcoming_tv_shows['results'],top_rated_tv_shows=top_rated_tv_shows['results'])
@routes.route('/animes')
def animes():
    return render_template('animes.html')
@routes.route('/search', methods=['GET', 'POST'])
def search():
    query = request.form.get('query') if request.method == 'POST' else request.args.get('query')
    page = request.args.get('page', 1, type=int)  # Get the page number from the query parameter
    if query:
            # Call the search_movies function to get search results
            results = search_movies(query,page)
            # Check if the API response contains results
            if 'results' in results:
                return render_template('search_results.html', results=results['results'],query=query,current_page=page,total_pages=results['total_pages'])
            else:
                return render_template('search_results.html', error="No results found.")
    else:
            return render_template('search.html', error="Please enter a query to search.")
    
    # Handle the case for GET requests (initial form render)



@routes.route('/home')
def home():
    trending_movies = get_tmdb_data('/trending/movie/day')
    trending_tv_shows = get_tmdb_data('/trending/tv/day')


    return render_template('home.html',trending_movies=trending_movies['results'],trending_tv_shows=trending_tv_shows['results'])

@routes.route('/movie-details/<int:movie_id>')
def movie_details(movie_id):
    movie_data = get_movie_details(movie_id)
    return render_template('movie_details.html', movie=movie_data)   


@routes.route('/tv-show-details/<int:tv_id>')
def tv_show_details(tv_id):
    tv_data = get_tv_show_details(tv_id)  # Fetch TV show details using the function we created
    return render_template('tv_shows_details.html', tv_show=tv_data)  # Pass the data to the template

@routes.route('/movies/popular', methods=['GET'])
def popular_movies():
    movies = get_movies()
    return jsonify(movies)  # Return the movies (or error) as a JSON response
@routes.route('/tv_shows/popular', methods=['GET'])
def popular_tv_shows():
    tv_shows = get_tv_shows()
    return jsonify(tv_shows)
@routes.route('/movies/top_rated', methods=['GET'])
def top_rated_movies():
    movies = get_top_rated_movies()
    return jsonify(movies)

@routes.route('/watchmovie')
def watchmovie():
    return render_template('watchmovie.html')