document.addEventListener('DOMContentLoaded', () => {
    const videoSlots = document.querySelectorAll('.video-container'); // Select all video containers
    const searchBar = document.getElementById('searchBar'); // Get the search bar input

    // Function to filter videos based on search input
    const filterVideos = (query) => {
        const searchTerm = query.toLowerCase(); // Convert query to lowercase for case-insensitive search
        videoSlots.forEach(videoSlot => {
            const videoTitle = videoSlot.querySelector('.vid-heading').textContent.toLowerCase(); // Get video title
            if (videoTitle.includes(searchTerm)) {
                videoSlot.style.display = ''; // Show video if it matches the search term
            } else {
                videoSlot.style.display = 'none'; // Hide video if it doesn't match
            }
        });
    };

    // Listen to search bar input
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value;
        filterVideos(query); // Call the filter function when the user types in the search bar
    });

    // Comments and ratings logic
    videoSlots.forEach(videoSlot => {
        const commentInput = videoSlot.querySelector('.comment-input');
        const submitCommentButton = videoSlot.querySelector('.submit-comment');
        const commentsList = videoSlot.querySelector('.comments-list');
        const ratingStars = videoSlot.querySelectorAll('.rating-star');
        const ratingResult = videoSlot.querySelector('.rating-result');
        let currentRating = 0; // Variable to store the current rating

        // Load comments from localStorage
        const loadComments = () => {
            const videoId = videoSlot.querySelector('.vid-heading').textContent; // Get video title for uniqueness
            const comments = JSON.parse(localStorage.getItem(videoId)) || []; // Store comments per video
            commentsList.innerHTML = ''; // Clear the existing comments
            comments.forEach(({ comment, rating }, index) => {
                const li = document.createElement('li');
                li.textContent = comment;

                // Display the rating for each comment
                const ratingDisplay = document.createElement('span');
                ratingDisplay.textContent = ` (Rating: ${rating})`;
                li.appendChild(ratingDisplay);

                // Create a delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-comment';
                deleteButton.addEventListener('click', () => {
                    deleteComment(index); // Call the delete function with the comment index
                });

                li.appendChild(deleteButton); // Append the delete button to the comment
                commentsList.appendChild(li);
            });
        };

        // Function to delete a comment
        const deleteComment = (index) => {
            const videoId = videoSlot.querySelector('.vid-heading').textContent; // Get video title for uniqueness
            const comments = JSON.parse(localStorage.getItem(videoId)) || [];
            comments.splice(index, 1); // Remove the comment at the specified index
            localStorage.setItem(videoId, JSON.stringify(comments)); // Update localStorage
            loadComments(); // Reload comments
        };

        loadComments(); // Load comments on page load

        // Submit comment
        submitCommentButton.addEventListener('click', () => {
            const comment = commentInput.value.trim();
            if (comment) {
                const videoId = videoSlot.querySelector('.vid-heading').textContent; // Get video title for uniqueness
                const comments = JSON.parse(localStorage.getItem(videoId)) || [];
                // Store both comment and rating
                comments.push({ comment, rating: currentRating });
                localStorage.setItem(videoId, JSON.stringify(comments));
                loadComments(); // Reload comments
                commentInput.value = ''; // Clear input
                currentRating = 0; // Reset current rating after submission
                updateRatingDisplay(); // Reset the displayed rating
            }
        });

        // Handle rating
        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = Number(star.getAttribute('data-rating')); // Ensure rating is a number
                ratingResult.textContent = `Rating: ${currentRating}`;
                ratingStars.forEach(s => {
                    s.classList.remove('active'); // Remove active class
                });
                for (let i = 0; i < currentRating; i++) {
                    ratingStars[i].classList.add('active'); // Add active class
                }
            });
        });

        // Function to reset rating display
        const updateRatingDisplay = () => {
            ratingResult.textContent = 'No ratings yet'; // Reset to zero
            ratingStars.forEach(s => {
                s.classList.remove('active'); // Remove active class
            });
        };
    });
});
