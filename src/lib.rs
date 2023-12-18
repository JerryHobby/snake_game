use wasm_bindgen::prelude::*;
mod snake;
use snake::{Snake, SnakeCell};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

enum Direction {
    Left,
    Right,
    Up,
    Down,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    fn my_log(s: &str);
    //fn loadSnake();
    //fn load_snake();
}

#[allow(dead_code)]
#[wasm_bindgen]
struct World {
    width: usize,
    size: usize,
    snake: Snake,
    reward_cell_idx: usize,
    collision: bool,
}

#[allow(dead_code)]
#[wasm_bindgen]
impl World {
    pub fn new(width: usize, spawn_idx: usize, direction: &str) -> World {
        let snake_size: usize = 3;
        let initial_direction = match direction {
            "up" => Direction::Up,
            "down" => Direction::Down,
            "left" => Direction::Left,
            "right" => Direction::Right,
            _ => Direction::Right,
        };
        let size = width * width;
        let snake = Snake::new(spawn_idx, snake_size, initial_direction);
        let reward_cell_idx = gen_reward_cell_idx(&snake, size);

        World {
            width,
            size,
            snake,
            reward_cell_idx,
            collision: false,
        }
    }

    pub fn game_over(&self) -> bool {
        if self.snake.body.len() >= self.size {
            my_log("Game Over: Snake is full");
            return true;
        }
        if self.collision {
            my_log("Game Over: Collision");
            return true;
        }
        false
    }

    pub fn reward_cell_idx(&self) -> usize {
        self.reward_cell_idx
    }

    pub fn set_width(&mut self, width: usize) {
        self.width = width;
        self.size = width * width;
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn getx(&self, index: usize) -> usize {
        index % self.width
    }

    pub fn gety(&self, index: usize) -> usize {
        index / self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn extend_snake(&mut self) {
        self.snake.new_cell();
        my_log("Extended Snake");
    }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn update(&mut self, direction: &str) {
        let snake_head_idx = self.snake_head_idx();

        let left_edge = snake_head_idx % self.width == 0;
        let right_edge = snake_head_idx % self.width == self.width - 1;
        let top_edge = snake_head_idx < self.width;
        let bottom_edge = snake_head_idx >= self.size - self.width;

        for i in (1..self.snake.body.len()).rev() {
            self.snake.body[i].0 = self.snake.body[i - 1].0
        }

        match direction {
            "left" => {
                self.snake.direction = Direction::Left;
                if !left_edge {
                    self.snake.body[0].0 -= 1;
                } else {
                    self.snake.body[0].0 += self.width - 1;
                }
            }
            "right" => {
                self.snake.direction = Direction::Right;
                if !right_edge {
                    self.snake.body[0].0 += 1;
                } else {
                    self.snake.body[0].0 -= self.width - 1;
                }
            }
            "up" => {
                self.snake.direction = Direction::Up;
                if !top_edge {
                    self.snake.body[0].0 -= self.width;
                } else {
                    self.snake.body[0].0 += self.size - self.width;
                }
            }
            "down" => {
                self.snake.direction = Direction::Down;
                if !bottom_edge {
                    self.snake.body[0].0 += self.width;
                } else {
                    self.snake.body[0].0 -= self.size - self.width;
                }
            }
            _ => (),
        }

        // if snake head is on shake body game over
        if self.snake.body[1..]
            .iter()
            .any(|cell| cell.0 == self.snake.body[0].0)
        {
            my_log("Game Over: Snake hit itself");
            self.collision = true;
        }

        let msg: String = format!(
            "HEAD: {} REWARD {}.",
            self.snake.body[0].0, self.reward_cell_idx
        );
        my_log(msg.as_str());

        // if head on reward
        if self.snake.body[0].0 == self.reward_cell_idx {
            // add snake
            // new reward
            self.extend_snake();
            self.reward_cell_idx = gen_reward_cell_idx(&self.snake, self.size);
        }
    }
}

fn gen_reward_cell_idx(snake: &Snake, size: usize) -> usize {
    let mut reward_cell_idx = fastrand::usize(0..size);
    while snake.body.iter().any(|cell| cell.0 == reward_cell_idx) {
        reward_cell_idx = fastrand::usize(0..size);
    }
    reward_cell_idx
}
