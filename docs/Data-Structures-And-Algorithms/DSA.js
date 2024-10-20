document.addEventListener('DOMContentLoaded', () => {
    const videoSlots = document.querySelectorAll('.video-container');
    const searchBar = document.getElementById('searchBar');

    const filterVideos = (query) => {
        const searchTerm = query.toLowerCase();
        videoSlots.forEach(videoSlot => {
            const videoTitle = videoSlot.querySelector('.vid-heading').textContent.toLowerCase();
            if (videoTitle.includes(searchTerm)) {
                videoSlot.style.display = '';
            } else {
                videoSlot.style.display = 'none';
            }
        });
    };

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value;
        filterVideos(query);
    });

    videoSlots.forEach(videoSlot => {
        const commentInput = videoSlot.querySelector('.comment-input');
        const submitCommentButton = videoSlot.querySelector('.submit-comment');
        const commentsList = videoSlot.querySelector('.comments-list');
        const ratingStars = videoSlot.querySelectorAll('.rating-star');
        const ratingResult = videoSlot.querySelector('.rating-result');
        let currentRating = 0;

        const loadComments = () => {
            const videoId = videoSlot.querySelector('.vid-heading').textContent;
            const comments = JSON.parse(localStorage.getItem(videoId)) || [];
            commentsList.innerHTML = '';
            comments.forEach(({ comment, rating }, index) => {
                const li = document.createElement('li');
                li.textContent = comment;

                const ratingDisplay = document.createElement('span');
                ratingDisplay.textContent = ` (Rating: ${rating})`;
                li.appendChild(ratingDisplay);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-comment';
                deleteButton.addEventListener('click', () => {
                    deleteComment(index);
                });

                li.appendChild(deleteButton);
                commentsList.appendChild(li);
            });
        };

        const deleteComment = (index) => {
            const videoId = videoSlot.querySelector('.vid-heading').textContent;
            const comments = JSON.parse(localStorage.getItem(videoId)) || [];
            comments.splice(index, 1);
            localStorage.setItem(videoId, JSON.stringify(comments));
            loadComments();
        };

        loadComments();

        submitCommentButton.addEventListener('click', () => {
            const comment = commentInput.value.trim();
            if (comment) {
                const videoId = videoSlot.querySelector('.vid-heading').textContent;
                const comments = JSON.parse(localStorage.getItem(videoId)) || [];
                comments.push({ comment, rating: currentRating });
                localStorage.setItem(videoId, JSON.stringify(comments));
                loadComments();
                commentInput.value = '';
                currentRating = 0;
                updateRatingDisplay();
            }
        });

        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = Number(star.getAttribute('data-rating'));
                ratingResult.textContent = `Rating: ${currentRating}`;
                ratingStars.forEach(s => {
                    s.classList.remove('active');
                });
                for (let i = 0; i < currentRating; i++) {
                    ratingStars[i].classList.add('active');
                }
            });
        });

        const updateRatingDisplay = () => {
            ratingResult.textContent = 'No ratings yet';
            ratingStars.forEach(s => {
                s.classList.remove('active');
            });
        };
    });
});
