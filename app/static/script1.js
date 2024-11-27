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

let currentIndex = 0;  // Keeps track of the current slide
let slides = [];  // Initialize an empty array to hold the slides
const slidesContainer = document.getElementById('slides-container');  // The container where slides are inserted
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// Fetch and display movies
async function fetchTopRated() {
  try {
    const response = await fetch('/movies/top_rated'); // Replace with your actual backend route
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return;
    }
    

    // Create and insert slides dynamically
    slides = data.results.map(topRated => {
      const slide = document.createElement('div');
      slide.classList.add('slide');  // Add class to each slide
      slide.innerHTML = `
        <div class="movie-image">
        <img src="https://image.tmdb.org/t/p/w500/${topRated.poster_path}" alt="${topRated.title}">
        <div class="play-button">▶</div>
      </div>
      <div class="movie-details">
        <div class="tags">
          <div class="tag">HD</div>
          <div class="tag">Movie</div>
          <div class="tag">${new Date(topRated.release_date).getFullYear()}</div>
        </div>
        <h2>${ topRated.title}</h2>
        <div class="rating">⭐ ${topRated.vote_average.toFixed(1)}</div>
        <p class="description">${topRated.overview.substring(0, 150)}...</p>
        <a href="#" class="watch-now">Watch now</a>
      </div>
      `;
      slidesContainer.appendChild(slide);  // Append the slide to the container
      return slide;  // Return the slide element for later use
    });

    updateSlidePosition();  // Update the position to display the first slide correctly
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

// Show the next slide
function nextSlide() {
  if (slides.length === 0) return;  // Ensure there are slides before navigating

  if (currentIndex < slides.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;  // Loop back to the first slide
  }
  updateSlidePosition();
}

// Show the previous slide
function prevSlide() {
  if (slides.length === 0) return;  // Ensure there are slides before navigating

  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - 1;  // Loop back to the last slide
  }
  updateSlidePosition();
}

// Update the position of the slides to show the correct one
function updateSlidePosition() {
  if (slides.length === 0) return;  // Ensure there are slides to update

  const slideWidth = slides[0].offsetWidth;  // Get the width of the slides
  slidesContainer.style.transform = `translateX(-${slideWidth * currentIndex}px)`;  // Move the slides container to show the current slide
}

// Attach event listeners to navigation buttons
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', fetchTopRated);
