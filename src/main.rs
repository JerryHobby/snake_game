// Import the necessary modules and structs

use identification::{Id, License, Passport};
use person::Person;

// Include the identification and person modules
mod identification;
mod person;

/// The main function of the program.
///
/// It creates a vector of `Person` structs, each with an identification document (`Id`).
/// The identification document can be either a `License` or a `Passport`.
/// It then prints each person and their identification document,
/// and checks if the identification document is expired.
/// Finally, it serializes each person into a JSON string and prints it.

fn main() {
    // Create a vector to hold the people

    let mut people: Vec<Person> = Vec::new();

    // Create a person with a driver's license
    people.push(Person::new(
        Id::DL(License::new("CA", "123456", "2021-01-01")),
        "John",
        "Doe",
        30,
    ));

    // Create a person with a passport
    people.push(Person::new(
        Id::PASSORT(Passport::new("US", "999AE1234", "2025-01-01")),
        "Jane",
        "Doe",
        20,
    ));

    // Iterate over the people in the vector

    for person in people {
        // Print the person and whether their identification document is expired
        println!(
            "\n\nPerson: {:#?}:  \nExpired? {}",
            person,
            person.id.expired()
        );

        // Serialize the person into a JSON string and print it
        let json = serde_json::to_string(&person).unwrap();
        println!("JSON: {}", json);
    }
}
