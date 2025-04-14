use std::fmt;

#[derive(Debug)]
pub enum RepositoryError {
    DatabaseError(diesel::result::Error),
    NotFound,
    ValidationError(String),
}

impl From<diesel::result::Error> for RepositoryError {
    fn from(error: diesel::result::Error) -> Self {
        match error {
            diesel::result::Error::NotFound => RepositoryError::NotFound,
            _ => RepositoryError::DatabaseError(error),
        }
    }
}

impl fmt::Display for RepositoryError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RepositoryError::DatabaseError(e) => write!(f, "Database Error: {}", e),
            RepositoryError::NotFound => write!(f, "Entity not found"),
            RepositoryError::ValidationError(e) => write!(f, "Validation Error: {}", e),
        }
    }
}

pub trait Entity {
    type Id: ToString;

    fn id(&self) -> &Self::Id;
    fn created_at(&self) -> &str;
    fn updated_at(&self) -> &str;
}

pub trait CreateDTO<T: Entity> {
    fn into_entity(self) -> T;
}

pub trait UpdateDTO {}

pub trait Repository<T: Entity> {
    fn find_all(&mut self) -> Result<Vec<T>, RepositoryError>;
    fn find_by_id(&mut self, id: &T::Id) -> Result<T, RepositoryError>;
    fn create(&mut self, entity: &T) -> Result<(), RepositoryError>;
    fn update(&mut self, id: &T::Id, dto: &dyn UpdateDTO) -> Result<T, RepositoryError>;
    fn delete(&mut self, id: &T::Id) -> Result<usize, RepositoryError>;
}
