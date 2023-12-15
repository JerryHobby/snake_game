import init, {World} from 'snake_game';

init().then(_ => {
    const WORLD_WIDTH = 20;
    const CELL_SIZE = 30;
    const GRID_COLOR = "#d0e8d0";
    const GRID_FILL_COLOR = "#f4fcf4";

    const world = World.new(WORLD_WIDTH);
    //world.set_width(WORLD_WIDTH * 2);

    const worldWidth = world.width();

    const canvas = document.getElementById("snake-canvas");
    const ctx = canvas.getContext("2d");

    let snake_head_img = new Image();
    snake_head_img.src = './assets/snake_head.png';
    snake_head_img.width = CELL_SIZE;
    snake_head_img.height = CELL_SIZE;

    let snake_body_img = new Image();
    snake_body_img.src = './assets/snake_body.png';
    snake_body_img.width = CELL_SIZE;
    snake_body_img.height = CELL_SIZE;

    canvas.height = canvas.width = worldWidth * CELL_SIZE;
    ctx.fillStyle = GRID_COLOR;

    function drawWorld() {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
        ctx.fillStyle = GRID_FILL_COLOR;
        ctx.lineWidth = 1;

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

    const drawCell = (x, y, img, rotationAngle) => {
        // Translate to the center of the image
        ctx.translate((x * CELL_SIZE) + (CELL_SIZE / 2), (y * CELL_SIZE) + (CELL_SIZE / 2));

        // Rotate the canvas
        ctx.rotate(rotationAngle);

        // Draw the image
        ctx.drawImage(img, -CELL_SIZE / 2 +1, -CELL_SIZE / 2 +1, CELL_SIZE-2, CELL_SIZE-2);

        // Rotate the canvas back and move the origin back to top-left corner
        ctx.rotate(-rotationAngle);
        ctx.translate(-(x * CELL_SIZE -1) - (CELL_SIZE / 2 -1), -(y * CELL_SIZE) - (CELL_SIZE / 2));
    }

    snake_head_img.onload = function() {
        const LEFT = 3 * Math.PI / 2;
        const RIGHT = Math.PI / 2;
        const UP = 0;
        const DOWN = Math.PI;

        drawWorld();
        console.log("snake_head_img.onload");
        drawCell(
            world.snake_head() % worldWidth,
            Math.floor(world.snake_head() / worldWidth),
            snake_head_img,
            UP);
    }
});


