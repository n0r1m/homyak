// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game objects
const car = {
    x: 50,
    y: canvas.height - 100,
    width: 60,
    height: 40,
    jumping: false,
    jumpForce: 0,
    gravity: 0.6,
    jumpStrength: -15
};

const obstacles = [];
const coins = [];
let score = 0;
let gameSpeed = 5;
let gameLoop;
let isGameRunning = false;

// Game functions
function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 60,
        width: 30,
        height: 40,
        passed: false
    });
}

function createCoin() {
    coins.push({
        x: canvas.width,
        y: canvas.height - 120,
        width: 20,
        height: 20,
        collected: false
    });
}

function jump() {
    if (!car.jumping) {
        car.jumping = true;
        car.jumpForce = car.jumpStrength;
    }
}

function update() {
    // Update car position
    if (car.jumping) {
        car.y += car.jumpForce;
        car.jumpForce += car.gravity;
        
        if (car.y >= canvas.height - 100) {
            car.y = canvas.height - 100;
            car.jumping = false;
        }
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        
        // Check collision
        if (checkCollision(car, obstacles[i])) {
            gameOver();
        }
        
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].x -= gameSpeed;
        
        // Check coin collection
        if (checkCollision(car, coins[i]) && !coins[i].collected) {
            coins[i].collected = true;
            score += 10;
            scoreElement.textContent = score;
            coins.splice(i, 1);
        }
        
        // Remove off-screen coins
        if (coins[i].x + coins[i].width < 0) {
            coins.splice(i, 1);
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw car
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Draw obstacles
    ctx.fillStyle = '#FFA500';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw coins
    ctx.fillStyle = '#FFD700';
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    if (isGameRunning) return;
    
    // Reset game state
    obstacles.length = 0;
    coins.length = 0;
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 5;
    isGameRunning = true;
    
    // Start game loop
    gameLoop();
    
    // Start obstacle and coin generation
    setInterval(createObstacle, 2000);
    setInterval(createCoin, 1500);
    
    // Hide start button
    startButton.style.display = 'none';
}

function gameOver() {
    isGameRunning = false;
    startButton.style.display = 'block';
    startButton.textContent = 'Play Again';
    
    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
}

// Event listeners
startButton.addEventListener('click', startGame);
canvas.addEventListener('click', jump);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
}); 