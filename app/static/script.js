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



    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
  
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
      });
    }
  
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
  
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }
  
    showSlide(currentSlide);