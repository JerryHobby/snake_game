use chrono::Utc;
use serde::{Deserialize, Serialize};

/// The `License` struct represents a driver's license.
/// It contains the state of issuance, the license number, and the expiration date.

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
pub struct License {
    state: String,
    number: String,
    expiration: String,
}

impl License {
    /// Constructs a new `License`.
    ///
    /// # Arguments
    ///
    /// * `state` - A string slice that holds the state of issuance.
    /// * `number` - A string slice that holds the license number.
    /// * `expiration` - A string slice that holds the expiration date.

    pub fn new(state: &str, number: &str, expiration: &str) -> License {
        License {
            state: state.to_string(),
            number: number.to_string(),
            expiration: expiration.to_string(),
        }
    }

    /// Checks if the license is expired.
    ///
    /// # Returns
    ///
    /// * `bool` - `true` if the license is expired, `false` otherwise.

    pub fn expired(&self) -> bool {
        self.expiration < Utc::now().format("%Y-%m-%d").to_string()
    }
}

/// The `Passport` struct represents a passport.
/// It contains the country of issuance, the passport number, and the expiration date.

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
pub struct Passport {
    country: String,
    number: String,
    expiration: String,
}

impl Passport {
    /// Constructs a new `Passport`.
    ///
    /// # Arguments
    ///
    /// * `country` - A string slice that holds the country of issuance.
    /// * `number` - A string slice that holds the passport number.
    /// * `expiration` - A string slice that holds the expiration date.

    pub fn new(country: &str, number: &str, expiration: &str) -> Passport {
        Passport {
            country: country.to_string(),
            number: number.to_string(),
            expiration: expiration.to_string(),
        }
    }

    /// Checks if the passport is expired.
    ///
    /// # Returns
    ///
    /// * `bool` - `true` if the passport is expired, `false` otherwise.

    pub fn expired(&self) -> bool {
        self.expiration < Utc::now().format("%Y-%m-%d").to_string()
    }
}

/// The `Id` enum represents an identification document.
/// It can be either a `License` or a `Passport`.

#[derive(Debug, Serialize, Deserialize)]
#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
pub enum Id {
    DL(License),
    PASSORT(Passport),
}

#[allow(dead_code)]
#[allow(unused_variables)] // Suppress warnings
impl Id {
    /// Checks if the identification document is expired.
    ///
    /// # Returns
    ///
    /// * `bool` - `true` if the identification document is expired, `false` otherwise.

    pub fn expired(&self) -> bool {
        match self {
            Id::DL(license) => license.expired(),
            Id::PASSORT(passport) => passport.expired(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::person::identification::License;
    use chrono::Utc;

    #[test]
    fn test_license_expired() {
        let license = License::new("CA", "123456", &Utc::now().format("%Y-%m-%d").to_string());
        assert_eq!(license.expired(), false);
    }

    #[test]
    fn test_passport_expired() {
        let passport = Passport::new(
            "US",
            "999AE1234",
            &Utc::now().format("%Y-%m-%d").to_string(),
        );
        assert_eq!(passport.expired(), false);
    }

    #[test]
    fn test_id_expired() {
        let license = License::new("CA", "123456", &Utc::now().format("%Y-%m-%d").to_string());
        let id = Id::DL(license);
        assert_eq!(id.expired(), false);
    }
}
