document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('movie-video');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    
    // Wait until the video is ready to play
    video.addEventListener('canplay', function () {
        initializeVideoControls();
    });

    // Initialize the play/pause control
    function initializeVideoControls() {
        // Ensure the play/pause button is updated with the correct icon
        updatePlayPauseButton();

        // Attach the play/pause toggle functionality
        playPauseBtn.addEventListener('click', togglePlayPause);
    }

    // Function to toggle between play and pause
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '❚❚';  // Update icon to 'pause'
        } else {
            video.pause();
            playPauseBtn.textContent = '▶';   // Update icon to 'play'
        }
    }

    // Update the button based on the video state
    function updatePlayPauseButton() {
        if (video.paused) {
            playPauseBtn.textContent = '▶';  // Show 'play' icon
        } else {
            playPauseBtn.textContent = '❚❚'; // Show 'pause' icon
        }
    }

    // Listen for the play/pause event to update button state
    video.addEventListener('play', updatePlayPauseButton);
    video.addEventListener('pause', updatePlayPauseButton);
});
