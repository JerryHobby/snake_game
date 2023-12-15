use wasm_bindgen::prelude::*;

mod snake;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

struct SnakeCell(
    usize
);

struct Snake {
    body: Vec<SnakeCell>,
}

impl Snake {
    pub fn new(spawn: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn)],
        }
    }
}


#[wasm_bindgen]
struct World {
    width: usize,
    snake: Snake,

    //(WORLD_WIDTH, CELL_SIZE, GRID_COLOR, SNAKE_COLOR, FOOD_COLOR);
}


#[wasm_bindgen]
impl World {
    pub fn new(width: usize) -> World {
        World {
            width: width,
            snake: Snake::new(width / 2 + (width * width) / 2),
        }
    }

    pub fn set_width(&mut self, width: usize) {
        self.width = width;
    }

    pub fn width(&self) -> usize {
        self.width
    }
    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }
}
