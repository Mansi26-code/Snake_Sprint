// Starting direction for the snake (still)
let inputDir = { x: 0, y: 0 };

// Add sound effects
const foodSound = new Audio('eat(1).ogg');
const gameOverSound = new Audio('over.ogg');
const musicSound = new Audio('musicSound.mp3');

// Game variables
let speed = 4;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };  // Adding initial food position
let score = 0;
let maxScore = localStorage.getItem('maxScore') ? JSON.parse(localStorage.getItem('maxScore')) : 0;
// Select the board element
const board = document.getElementById('board');
const scoreElement = document.getElementById('score');
const maxScoreElement = document.getElementById('maxScore');

// Initialize max score element
maxScoreElement.innerHTML = `Max Score: ${maxScore}`;

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snakeArr) {
    // If the snake collides with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // If the snake collides with the wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Update the snake array and its food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again!");

        // Update max score
        if (score > maxScore) {
            maxScore = score;
            localStorage.setItem('maxScore', JSON.stringify(maxScore));
        }

        // Reset game state
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreElement.innerHTML = `Score: ${score}`;
        maxScoreElement.innerHTML = `Max Score: ${maxScore}`;
        musicSound.play();
    }

    // If the snake has eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score++;
        scoreElement.innerHTML = `Score: ${score}`;
      
        // Add a new segment to the snake's body at the position of the current head plus the input direction
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        // Generate new random coordinates for the food within the grid
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    // Make the board empty
    board.innerHTML = "";

    // Display the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;  // row is y
        snakeElement.style.gridColumnStart = e.x;  // column is x
        // Add the class for styling
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    musicSound.play();
    inputDir = { x: 0, y: 1 }; // Start the game

    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});
