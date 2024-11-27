import requests
from flask import current_app 



def fetch_genres():
    api_key = current_app.config['TMDB_API_KEY']
    url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}'
    response = requests.get(url,verify=False)
    return response.json().get('genres', []) if response.status_code == 200 else []

def fetch_movie_by_genres(genre_ids,page=1):
    api_key = current_app.config['TMDB_API_KEY']

    genre_ids_str= ','.join(map(str, genre_ids))
   
    url = f'https://api.themoviedb.org/3/discover/movie?api_key={api_key}&with_genres={genre_ids_str}&page={page}'
    response = requests.get(url,verify=False)
    return response.json().get('results', []) if response.status_code == 200 else []





    

def get_tmdb_data(endpoint, params=None):
    base_url = current_app.config['TMDB_BASE_URL']
    api_key = current_app.config['TMDB_API_KEY']

    if params is None:
        params = {}
        params['api_key'] = api_key
        response = requests.get(f'{base_url}{endpoint}', params=params,verify=False)
        return response.json()
def get_movies():
    # Fetch popular movies from TMDb
    api_key = current_app.config['TMDB_API_KEY']
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Return JSON if the request is successful
    else:
        return {"error": "Failed to fetch data from TMDb API"}  # Handle any errors
def get_tv_shows():
    api_key = current_app.config['TMDB_API_KEY']
    url = f"https://api.themoviedb.org/3/tv/popular?api_key={api_key}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Return JSON if the request is successful
    else:
        return {"error": "Failed to fetch data from TMDb API"}  # Handle any errors
def get_top_rated_movies():
    api_key = current_app.config['TMDB_API_KEY']
    url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={api_key}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Return JSON if the request is successful
    else:
        return {"error": "Failed to fetch data from TMDb API"}  # Handle any errors
def search_movies(query,page=1):
    base_url = current_app.config['TMDB_BASE_URL']
    api_key = current_app.config['TMDB_API_KEY']

    url = f"{base_url}/search/movie"
    params = {
        "api_key": api_key,
        "query": query,
        "language": "en-US",
        "page": page
    }
    response = requests.get(url, params=params,verify=False)
    if response.status_code == 200:
        return response.json()  # Return JSON if the request is successful
    else:
        return {"error": "Failed to fetch data from TMDb API"}  # Handle any errors
def get_movie_details(movie_id):
    api_key = current_app.config['TMDB_API_KEY']
    details_url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US'
    details_response = requests.get(details_url).json()

    # Fetch the cast and crew information
    cast_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={api_key}&language=en-US'
    cast_response = requests.get(cast_url).json()
    
    # Fetch the trailer (video) information
    video_url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}&language=en-US'
    video_response = requests.get(video_url).json()
    
    # Add cast (only main cast) and trailer details to movie data
    movie_data = {
        'title': details_response['title'],
        'overview': details_response['overview'],
        'release_date': details_response['release_date'],
        'rating': details_response['vote_average'],
        'poster_path': details_response['poster_path'],
        'genres': [genre['name'] for genre in details_response['genres']],
        'cast': [cast['name'] for cast in cast_response['cast'][:5]],  # Limit to 5 main cast members
        'trailer': None
    }

    # Find the first YouTube trailer if available
    for video in video_response['results']:
        if video['type'] == 'Trailer' and video['site'] == 'YouTube':
            movie_data['trailer'] = f'https://www.youtube.com/embed/{video["key"]}'
            break

    return movie_data

def get_tv_show_details(tv_id):
    api_key = current_app.config['TMDB_API_KEY']
    details_url = f'https://api.themoviedb.org/3/tv/{tv_id}?api_key={api_key}&language=en-US'
    details_response = requests.get(details_url).json()

    # Fetch the cast and crew information
    cast_url = f'https://api.themoviedb.org/3/tv/{tv_id}/credits?api_key={api_key}&language=en-US'
    cast_response = requests.get(cast_url).json()
    
    # Fetch the trailer (video) information
    video_url = f'https://api.themoviedb.org/3/tv/{tv_id}/videos?api_key={api_key}&language=en-US'
    video_response = requests.get(video_url).json()
    
    # Add cast (only main cast) and trailer details to TV show data
    tv_show_data = {
        'title': details_response['name'],
        'overview': details_response['overview'],
        'first_air_date': details_response['first_air_date'],
        'rating': details_response['vote_average'],
        'poster_path': details_response['poster_path'],
        'genres': [genre['name'] for genre in details_response['genres']],
        'cast': [cast['name'] for cast in cast_response['cast'][:5]],  # Limit to 5 main cast members
        'trailer': None
    }

    # Find the first YouTube trailer if available
    for video in video_response['results']:
        if video['type'] == 'Trailer' and video['site'] == 'YouTube':
            tv_show_data['trailer'] = f'https://www.youtube.com/embed/{video["key"]}'
            break

    return tv_show_data
