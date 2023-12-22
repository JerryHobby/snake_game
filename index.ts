import init, {World} from "snake_game";

declare global {
    interface Window {
        my_log: (s: string) => void;
        startGame: () => void;
        resetGame: () => void;
        pauseGame: () => void;
        isGameOver: () => boolean;
    }
}

let game_pause: boolean = true;
let game_over: boolean = false;

window.startGame = startGame;
window.resetGame = resetGame;
window.pauseGame = pauseGame;
window.isGameOver = isGameOver;

function startGame() {
    window.my_log("startGame");
    if(game_over) {
        window.my_log("Resetting game");
        resetGame();
    } else {
        window.my_log("Resuming game");
        game_over = false;
        game_pause = false;
    }
}

function pauseGame() {
    game_pause = true;
}

function resetGame() {
    location.reload();
}

function isGameOver() {
    return game_over;
}

window.my_log = function(s: string) {
    const DEBUG = false;
    if (DEBUG) {
        console.log(s);
    }
};

init().then(wasm => {
    // game engine parameters
    const WORLD_WIDTH: number = 15;
    const SPAWN_IDX: number = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
    const CELL_SIZE: number = 30;
    const MIN_FPS: number = 3;

    // game interface parameters
    const GRID_COLOR: string = "#d0e8d0";
    const GRID_FILL_COLOR: string = "#f4fcf4";

    let game_fps: number = MIN_FPS;

    const DIRECTION = {
        LEFT: {
            angle: 3 * Math.PI / 2,
            label: "left",
        },
        RIGHT: {
            angle: Math.PI / 2,
            label: "right",
        },
        UP: {
            angle: 0,
            label: "up",
        },
        DOWN: {
            angle: Math.PI,
            label: "down",
        },
    }

    let direction = DIRECTION.RIGHT;

    const world: World = World.new(WORLD_WIDTH, SPAWN_IDX, direction.label);

    // pull data from world
    const worldWidth: number = world.width();
    let snakeCellPtr: number;
    let snakeLength: number;
    let snakeCells: Uint32Array;
    loadSnake();

    let snakeHead: HTMLImageElement = new Image();
    snakeHead.src = './assets/snake_head.png';

    let snakeBody: HTMLImageElement = new Image();
    snakeBody.src = './assets/snake_body.png';

    let snakeEgg: HTMLImageElement = new Image();
    snakeEgg.src = './assets/snake_egg.png';

    // create canvas
    const canvas: HTMLCanvasElement = document.getElementById("snake-canvas") as HTMLCanvasElement;
    const snake_score: HTMLSpanElement = document.getElementById("snake-score") as HTMLSpanElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.height = canvas.width = worldWidth * CELL_SIZE;
    ctx.fillStyle = GRID_COLOR;

    // draw opening board.
    snakeHead.onload = function () {
        paint();
    }
    snakeBody.onload = function () {
        paint();
    }
    snakeEgg.onload = function () {
        paint();
    }

    function loadSnake() {
        snakeCellPtr = world.snake_cells();
        snakeLength = world.snake_length();

        snakeCells = new Uint32Array(
            wasm.memory.buffer,
            snakeCellPtr,
            snakeLength
        );
    }

    function drawWorld(): void {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
        ctx.fillStyle = GRID_FILL_COLOR;
        ctx.lineWidth = 1;
        ctx.imageSmoothingQuality = "high";
        // Draw vertical lines
        for (let i = 0; i < worldWidth + 1; i++) {
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, worldWidth * CELL_SIZE);
        }
        // Draw horizontal lines
        for (let i = 0; i < worldWidth + 1; i++) {
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(worldWidth * CELL_SIZE, i * CELL_SIZE);
        }

        ctx.fillRect(0, 0, worldWidth * CELL_SIZE, worldWidth * CELL_SIZE);
        ctx.stroke();
    }

    const drawSnake = (): void => {
        loadSnake();

        // draw body first - so head is always on top
        snakeCells.forEach((cell, index) => {
                if (index !== 0) {
                    const img = snakeBody;
                    const x = world.getx(cell);
                    const y = world.gety(cell);
                    const cellx = x * CELL_SIZE;
                    const celly = y * CELL_SIZE;

                    ctx.drawImage(img, cellx, celly, CELL_SIZE, CELL_SIZE);
                }
            }
        )

        // draw head
        const cell = world.snake_head_idx();
        const rotationAngle = direction.angle;
        const img = snakeHead;
        const x = world.getx(cell);
        const y = world.gety(cell);

        // Translate to the center of the image
        ctx.translate((x * CELL_SIZE) + (CELL_SIZE / 2), (y * CELL_SIZE) + (CELL_SIZE / 2));
        ctx.rotate(rotationAngle);
        ctx.drawImage(img, -CELL_SIZE / 2 + 1, -CELL_SIZE / 2 + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Rotate the canvas back and move the origin back to top-left corner
        ctx.rotate(-rotationAngle);
        ctx.translate(-(x * CELL_SIZE) - (CELL_SIZE / 2), -(y * CELL_SIZE) - (CELL_SIZE / 2));
    }

    function draw_reward_cell() {
        const img = snakeEgg;
        const cell = world.reward_cell_idx();

        if (cell > worldWidth * worldWidth) {
            gameOver();
        }

        const x = world.getx(cell);
        const y = world.gety(cell);
        const cellx = x * CELL_SIZE;
        const celly = y * CELL_SIZE;

        ctx.drawImage(img, cellx, celly, CELL_SIZE, CELL_SIZE);
    }

    function paint(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        drawSnake();
        draw_reward_cell();
    }

    function update(): void {
        if (world.game_over()) {
            gameOver();
            return;
        }
        setTimeout(() => {
            if (game_pause) {
                requestAnimationFrame(update);
                return;
            }
            game_fps = MIN_FPS + Math.floor(world.snake_length() / 10);

            world.update(direction.label);
            snake_score_update();
            paint();
            requestAnimationFrame(update);
        }, 1000 / game_fps);
    }

    function gameOver() {
        game_pause = true;
        game_over = true;
        alert("Game Over!  Your score is " + snake_score.innerHTML + ".  Press OK to restart.");
    }

    function snake_score_update() {
        snake_score.innerHTML = String((world.snake_length() - 3 ) * 200);
    }

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            game_pause = false;
            if (direction === DIRECTION.RIGHT) {
                return;
            }
            direction = DIRECTION.LEFT;
        } else if (event.key === "ArrowRight") {
            game_pause = false;
            if (direction === DIRECTION.LEFT) {
                return;
            }
            direction = DIRECTION.RIGHT;
        } else if (event.key === "ArrowUp") {
            game_pause = false;
            if (direction === DIRECTION.DOWN) {
                return;
            }
            direction = DIRECTION.UP;
        } else if (event.key === "ArrowDown") {
            game_pause = false;
            if (direction === DIRECTION.UP) {
                return;
            }
            direction = DIRECTION.DOWN;
        } else if (event.key === " ") {
            game_pause = !game_pause;
        }
    });
    update();
});