use crate::repositories::base_repository::{CreateDTO, Entity, Repository, UpdateDTO};

pub trait Service<T, C, U, R>
where
    T: Entity + 'static,
    C: CreateDTO<T>,
    U: UpdateDTO,
    R: Repository<T>,
{
    fn get_all(repository: R) -> Result<Vec<T>, String>;
    fn get_by_id(repository: R, id: &T::Id) -> Result<T, String>;
    fn create(repository: R, dto: C) -> Result<T, String>;
    fn update(repository: R, id: &T::Id, dto: U) -> Result<T, String>;
    fn delete(repository: R, id: &T::Id) -> Result<(), String>;
}
