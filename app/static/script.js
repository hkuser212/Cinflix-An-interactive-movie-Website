var getHubergerIcon = document.getElementById("hamburger-menu");
    var getHubergerCrossIcon = document.getElementById("hamburger-cross");
    var getMobileMenu = document.getElementById("mobile-menu");

    getHubergerIcon.addEventListener("click", function () {
        console.log("hello");
        getMobileMenu.style.display = "flex";
        setTimeout(function () {
            getMobileMenu.style.transform = "translateX(0%)"; // Slide in the menu
        }, 50); // Add a small delay for better transition effect
    });

    getHubergerCrossIcon.addEventListener("click", function () {
        console.log("hello");
        getMobileMenu.style.transform = "translateX(-100%)"; // Slide out the menu
        setTimeout(function () {
            getMobileMenu.style.display = "none";
        }, 300); // Wait for the transition to end before hiding
    });

    // Check if screen size changes to desktop view and hide mobile menu
    window.addEventListener("resize", function () {
        if (window.innerWidth > 770) {
            getMobileMenu.style.display = "none";
        }
    });


    const arrows = document.querySelectorAll(".arrow");
    const movieLists = document.querySelectorAll(".movie-list");
    
    arrows.forEach((arrow, i) => {
      const itemNumber = movieLists[i].querySelectorAll("img").length;
      let clickCounter = 0;
      arrow.addEventListener("click", () => {
        const ratio = Math.floor(window.innerWidth / 270);
        clickCounter++;
        if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
          movieLists[i].style.transform = `translateX(${
            movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
          }px)`;
        } else {
          movieLists[i].style.transform = "translateX(0)";
          clickCounter = 0;
        }
      });
    
      console.log(Math.floor(window.innerWidth / 270));
    });

// Get all Watch buttons





    let currentIndex = 0;  // Keeps track of the current slide
    let slides = [];  // Initialize an empty array to hold the slides
    const slidesContainer = document.getElementById('slides-container');  // The container where slides are inserted
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    // Fetch and display movies
    async function fetchMovies() {
      try {
        const response = await fetch('/movies/popular'); // Replace with your actual backend route
        const data = await response.json();
    
        if (data.error) {
          console.error(data.error);
          return;
        }
        
  
        // Create and insert slides dynamically
        slides = data.results.map(movie => {
          const slide = document.createElement('div');
          slide.classList.add('slide');  // Add class to each slide
          slide.innerHTML = `
            <div class="movie-image">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <div class="play-button">▶</div>
          </div>
          <div class="movie-details">
            <div class="tags">
              <div class="tag">HD</div>
              <div class="tag">Movie</div>
              <div class="tag">${new Date(movie.release_date).getFullYear()}</div>
            </div>
            <h2>${movie.title}</h2>
            <div class="rating">⭐ ${movie.vote_average.toFixed(1)}</div>
            <p class="description">${movie.overview.substring(0, 150)}...</p>
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
    document.addEventListener('DOMContentLoaded', fetchMovies);
    