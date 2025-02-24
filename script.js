document.addEventListener('DOMContentLoaded', function () {
    const startMenu = document.getElementById('startMenu');
    const gameContainer = document.getElementById('game');
    const player = document.getElementById('player');
    const starsContainer = document.getElementById('stars');
    const scoreValue = document.getElementById('scoreValue');
    const livesValue = document.getElementById('livesValue');
    const gameOverText = document.getElementById('gameOver');
    const finalScore = document.getElementById('finalScore');

    let score, lives, gameSpeed, gameIsOver, gameLoopInterval;

    function updateScore() {
        score++;
        scoreValue.textContent = score;
    }

    function updateLives() {
        lives--;
        livesValue.textContent = lives;

        if (lives <= 0) {
            gameOver();
        }
    }

    function gameOver() {
        gameIsOver = true;
        finalScore.textContent = `Final Score: ${score}`;
        gameOverText.style.display = 'block';
        clearInterval(gameLoopInterval);
        setTimeout(() => {
            gameContainer.style.display = 'none';
            startMenu.style.display = 'flex';
        }, 3000);
    }
    

    function startGame(difficulty) {
        gameOverText.style.display = 'none';

        gameIsOver = false;
        
        score = 0;
        lives = 3;
        scoreValue.textContent = score;
        livesValue.textContent = lives;
    
        starsContainer.innerHTML = '';
    
        startMenu.style.display = 'none';
        gameContainer.style.display = 'block';
        
        switch (difficulty) {
            case 'easy':
                gameSpeed = 3;
                lives = 5;
                break;
            case 'medium':
                gameSpeed = 5;
                lives = 3;
                break;
            case 'hard':
                gameSpeed = 8;
                lives = 1;
                break;
            default:
                gameSpeed = 5;
                lives = 3;
        }
    
        livesValue.textContent = lives;
        
        gameLoopInterval = setInterval(() => {
            createStar();
        }, 2000);
    }
    
    

    document.getElementById('easyBtn').addEventListener('click', function () {
        startGame('easy');
    });

    document.getElementById('mediumBtn').addEventListener('click', function () {
        startGame('medium');
    });

    document.getElementById('hardBtn').addEventListener('click', function () {
        startGame('hard');
    });

    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * (window.innerWidth - 20)}px`;
        star.style.top = '0';
        starsContainer.appendChild(star);

        const fallInterval = setInterval(() => {
            if (!gameIsOver) {
                const starTop = parseInt(window.getComputedStyle(star).getPropertyValue('top'));

                if (starTop >= window.innerHeight) {
                    clearInterval(fallInterval);
                    star.remove();
                    updateLives();
                }

                const starBounds = star.getBoundingClientRect();
                const playerBounds = player.getBoundingClientRect();

                if (
                    starBounds.left < playerBounds.right &&
                    starBounds.right > playerBounds.left &&
                    starBounds.top < playerBounds.bottom &&
                    starBounds.bottom > playerBounds.top
                ) {
                    updateScore();
                    star.remove();
                }

                star.style.top = `${starTop + gameSpeed}px`;
            } else {
                clearInterval(fallInterval);
            }
        }, 20);
    }

    function movePlayer(key) {
        if (!gameIsOver) {
            if (key === 'ArrowLeft') {
                const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
                const newLeft = Math.max(0, playerLeft - 10);
                player.style.left = `${newLeft}px`;
            } else if (key === 'ArrowRight') {
                const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
                const playerWidth = parseInt(window.getComputedStyle(player).getPropertyValue('width'));
                const newLeft = Math.min(window.innerWidth - playerWidth, playerLeft + 10);
                player.style.left = `${newLeft}px`;
            }
        }
    }

    function followMouse(event) {
        if (!gameIsOver) {
            const gameWidth = parseInt(window.getComputedStyle(document.getElementById('game')).getPropertyValue('width'));
            const playerWidth = parseInt(window.getComputedStyle(player).getPropertyValue('width'));
            const mouseX = event.clientX;
            const newLeft = Math.max(0, Math.min(gameWidth - playerWidth, mouseX - playerWidth / 2));
            player.style.left = `${newLeft}px`;
        }
    }

    document.addEventListener('keydown', function (event) {
        movePlayer(event.key);
    });

    document.addEventListener('mousemove', followMouse);
});