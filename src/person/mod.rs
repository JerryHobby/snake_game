use crate::person::identification::Id;
use serde::{Deserialize, Serialize};

// Include the identification and person modules
pub mod identification;

/// The `Person` struct represents a person.
/// It contains an identification document (`Id`), first name, last name, and age.

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
pub struct Person {
    pub id: Id,
    pub first_name: String,
    pub last_name: String,
    pub age: u8,
}

#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
impl Person {
    /// Constructs a new `Person`.
    ///
    /// # Arguments
    ///
    /// * `id` - An `Id` that represents the person's identification document.
    /// * `first_name` - A string slice that holds the person's first name.
    /// * `last_name` - A string slice that holds the person's last name.
    /// * `age` - An unsigned 8-bit integer that holds the person's age.

    pub fn new(id: Id, first_name: &str, last_name: &str, age: u8) -> Person {
        Person {
            id,
            first_name: first_name.to_string(),
            last_name: last_name.to_string(),
            age,
        }
    }

    /// Returns the full name of the person.
    ///
    /// # Returns
    ///
    /// * `String` - The full name of the person.

    pub fn full_name(&self) -> String {
        format!("{} {}", self.first_name, self.last_name)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use identification::{Id, License, Passport};

    #[test]
    fn test_person_full_name() {
        let person = Person::new(
            Id::DL(License::new("CA", "123456", "2021-01-01")),
            "John",
            "Doe",
            30,
        );
        assert_eq!(person.full_name(), "John Doe");
    }

    #[test]
    fn test_person_age() {
        let person = Person::new(
            Id::PASSORT(Passport::new("US", "999AE1234", "2025-01-01")),
            "Jane",
            "Doe",
            20,
        );
        assert_eq!(person.age, 20);
    }
}
