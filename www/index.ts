import init, {World} from 'snake_game';

init().then( _ => {
    // game engine parameters
    const WORLD_WIDTH: number = 20;
    const SPAWN_IDX: number = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
    const CELL_SIZE: number = 30;

    const world: World = World.new(WORLD_WIDTH, SPAWN_IDX);
    const worldWidth: number = world.width();

    // game interface parameters
    const GRID_COLOR: string = "#d0e8d0";
    const GRID_FILL_COLOR: string = "#f4fcf4";

    let game_pause: boolean = true;
    let game_fps: number = 4;

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

    let directionKeys = Object.keys(DIRECTION) as (keyof typeof DIRECTION)[];
    let direction = DIRECTION[directionKeys[Date.now() % directionKeys.length]];

    let snakeHead: HTMLImageElement = new Image();
    snakeHead.src = './assets/snake_head.png';

    let snakeBody: HTMLImageElement = new Image();
    snakeBody.src = './assets/snake_body.png';

    // create canvas
    const canvas: HTMLCanvasElement = document.getElementById("snake-canvas") as HTMLCanvasElement;
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

    const drawSnake = (x: number, y: number, img: HTMLImageElement, rotationAngle: number): void => {
        // Translate to the center of the image
        ctx.translate((x * CELL_SIZE) + (CELL_SIZE / 2), (y * CELL_SIZE) + (CELL_SIZE / 2));

        // Rotate the canvas
        ctx.rotate(rotationAngle);

        // Draw the image
        ctx.drawImage(img, -CELL_SIZE / 2 + 1, -CELL_SIZE / 2 + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Rotate the canvas back and move the origin back to top-left corner
        ctx.rotate(-rotationAngle);
        ctx.translate(-(x * CELL_SIZE) - (CELL_SIZE / 2), -(y * CELL_SIZE) - (CELL_SIZE / 2));
    }

    function paint(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld();
        drawSnake(
            world.snake_head_idx() % worldWidth,
            Math.floor(world.snake_head_idx() / worldWidth),
            snakeHead,
            direction.angle,
        );
    }

    function update(): void {
        game_fps += 0.01
        setTimeout(() => {
            if (game_pause) {
                requestAnimationFrame(update);
                return;
            }
            world.update(direction.label);
            paint();
            requestAnimationFrame(update);
        }, 1000 / game_fps);
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
