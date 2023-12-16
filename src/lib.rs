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
    pub fn new(spawn_idx: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_idx)],
        }
    }
}


#[wasm_bindgen]
struct World {
    width: usize,
    size: usize,
    snake: Snake,

    //(WORLD_WIDTH, CELL_SIZE, GRID_COLOR, SNAKE_COLOR, FOOD_COLOR);
}


#[wasm_bindgen]
impl World {
    pub fn new(width: usize, spawn_idx: usize) -> World {
        World {
            width: width,
            size: width * width,
            snake: Snake::new(spawn_idx),
        }
    }

    pub fn set_width(&mut self, width: usize) {
        self.width = width;
        self.size = width * width;
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self, direction: &str) {
        let snake_head_idx = self.snake_head_idx();

        let left_edge = snake_head_idx % self.width == 0;
        let right_edge = snake_head_idx % self.width == self.width - 1;
        let top_edge = snake_head_idx < self.width;
        let bottom_edge = snake_head_idx >= self.size - self.width;

        match direction {
            "left" => if !left_edge {
                    self.snake.body[0].0 -= 1;
                } else {
                    self.snake.body[0].0 += self.width - 1;
                },
            "right" => if !right_edge {
                    self.snake.body[0].0 += 1;
                } else {
                    self.snake.body[0].0 -= self.width - 1;
                },
            "up" => if !top_edge {
                    self.snake.body[0].0 -= self.width;
                } else {
                    self.snake.body[0].0 += self.size - self.width;
                },
            "down" => if !bottom_edge {
                    self.snake.body[0].0 += self.width;
                } else {
                    self.snake.body[0].0 -= self.size - self.width;
                },
            _ => (),
        }
    }
}
