use crate::Direction;
use wasm_bindgen::prelude::wasm_bindgen;

pub struct SnakeCell(pub(crate) usize);

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    fn my_log(s: &str);
    //fn loadSnake();
    //fn load_snake();
}

#[allow(dead_code)]
pub(crate) struct Snake {
    pub(crate) body: Vec<SnakeCell>,
    pub(crate) direction: Direction,
}

#[allow(dead_code)]
impl Snake {
    pub(crate) fn new(spawn_index: usize, size: usize, direction: Direction) -> Snake {
        let mut body = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake { body, direction }
    }
    pub(crate) fn new_cell(&mut self) {
        let cell = self.body.last().unwrap().0;
        self.body.push(SnakeCell(cell));
    }
}
