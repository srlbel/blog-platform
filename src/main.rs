mod models;
mod repositories;
mod schema;
mod services;

use actix_web::{App, HttpServer, middleware, web};
use diesel::r2d2::{self, ConnectionManager};
use diesel::sqlite::SqliteConnection;

pub type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

fn initialize_db_pool() -> DbPool {
    let conn_spec = std::env::var("DB_URL").expect("DB_URL must be set");
    let manager = r2d2::ConnectionManager::<SqliteConnection>::new(conn_spec);

    r2d2::Pool::builder()
        .build(manager)
        .expect("database URL should be valid path to SQLite DB File")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = initialize_db_pool();
    log::info!("Http Server at http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
