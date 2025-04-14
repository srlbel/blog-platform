use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

use crate::models::blog::{Blog, UpdateBlogDto};
use crate::repositories::base_repository::{
    CreateDTO, Entity, Repository, RepositoryError, UpdateDTO,
};
use crate::schema::blogs;

pub struct BlogRepository {
    connection: SqliteConnection,
}

impl BlogRepository {
    pub fn new(connection: SqliteConnection) -> Self {
        Self { connection }
    }
}

impl Repository<Blog> for BlogRepository {
    fn find_all(&mut self) -> Result<Vec<Blog>, RepositoryError> {
        todo!()
    }
    fn create(&mut self, entity: &Blog) -> Result<(), RepositoryError> {
        todo!()
    }
    fn delete(&mut self, id: &<Blog as Entity>::Id) -> Result<usize, RepositoryError> {
        todo!()
    }
    fn find_by_id(&mut self, id: &<Blog as Entity>::Id) -> Result<Blog, RepositoryError> {
        todo!()
    }
    fn update(
        &mut self,
        id: &<Blog as Entity>::Id,
        dto: &dyn UpdateDTO,
    ) -> Result<Blog, RepositoryError> {
        todo!()
    }
}
