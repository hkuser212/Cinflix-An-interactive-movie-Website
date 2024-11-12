let selectedGenres = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchGenres();
    fetchMovies();
});

async function fetchGenres() {
    const response = await fetch('/api/genres');
    const genres = await response.json();
    const genreContainer = document.getElementById('genres');
    
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre.name;
        button.onclick = () => toggleGenre(genre.id, button);
        genreContainer.appendChild(button);
    });
}

function toggleGenre(genreId, button) {
    if (selectedGenres.includes(genreId)) {
        selectedGenres = selectedGenres.filter(id => id !== genreId);
        button.classList.remove('active');
    } else {
        selectedGenres.push(genreId);
        button.classList.add('active');
    }
    fetchMovies();
}

function clearGenres() {
    selectedGenres = [];  // Clear selected genres array
    const genreButtons = document.querySelectorAll('.genre-buttons');
    genreButtons.forEach(button => button.classList.remove('selected'));  // Deselect buttons
    fetchMovies();  // Fetch all movies without any genre filter
  }
  
async function fetchMovies() {
    const response = await fetch('/api/movies2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genres: selectedGenres, page: currentPage })
    });
    const movies = await response.json();
    displayMovies(movies);
}



function displayMovies(movies) {
    const movieContainer = document.getElementById('movies2');
    movieContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        img.alt = movie.title;
        
        const title = document.createElement('h3');
        title.textContent = movie.title;

        // Create the Watch button
        const watchButton = document.createElement('button');
        watchButton.textContent = 'Watch';
        watchButton.onclick = () => redirectToDetails(movie.id);

        console.log(`Adding Watch button for ${movie.title}`); // Debugging line

        // Append elements to the movie card
        movieCard.appendChild(img);
        movieCard.appendChild(title);
        movieCard.appendChild(watchButton);
        movieContainer.appendChild(movieCard);
    });
}

function redirectToDetails(movieId) {
    window.location.href = `/movie-details/${movieId}`;
}


function changePage(offset) {
    currentPage += offset;
    if (currentPage < 1) currentPage = 1;
    document.getElementById('page-number').textContent = `Page ${currentPage}`;
    fetchMovies();
}
