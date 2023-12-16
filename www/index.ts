import init, {World} from 'snake_game';

init().then( _ => {
    let game_speed: number = 200;
    let game_pause: boolean = true;
    const WORLD_WIDTH: number = 20;
    const CELL_SIZE: number = 30;
    const GRID_COLOR: string = "#d0e8d0";
    const GRID_FILL_COLOR: string = "#f4fcf4";
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

    const world: World = World.new(WORLD_WIDTH);
    const worldWidth: number = world.width();

    const canvas: HTMLCanvasElement = document.getElementById("snake-canvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

    let snake_head_img: HTMLImageElement = new Image();
    snake_head_img.src = './assets/snake_head.png';

    let snake_body_img: HTMLImageElement = new Image();
    snake_body_img.src = './assets/snake_body.png';

    canvas.height = canvas.width = worldWidth * CELL_SIZE;
    ctx.fillStyle = GRID_COLOR;

    snake_head_img.onload = function () {
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
            snake_head_img,
            direction.angle,
        );
    }

    function update(): void {
        setTimeout(() => {
            if (game_pause) {
                requestAnimationFrame(update);
                return;
            }
            world.update(direction.label);
            paint();
            requestAnimationFrame(update);
        }, game_speed);
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
