use chrono::{DateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add schema.
use crate::repositories::base_repository::{CreateDTO, Entity, UpdateDTO};
use crate::schema::blogs;

#[derive(Debug, Serialize, Deserialize, Clone, Queryable, Insertable)]
#[diesel(table_name = blogs)]
pub struct Blog {
    pub id: String,
    pub title: String,
    pub content: String,
    pub creator: String,
    pub created_at: String,
    pub updated_at: String,
}

impl Entity for Blog {
    type Id = String;

    fn id(&self) -> &Self::Id {
        &self.id
    }

    fn created_at(&self) -> &str {
        &self.created_at
    }

    fn updated_at(&self) -> &str {
        &self.updated_at
    }
}

#[derive(Debug, Serialize)]
pub struct BlogResponse {
    pub id: String,
    pub title: String,
    pub content: String,
    pub creator: String,
    #[serde(with = "chrono::serde::ts_seconds")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "chrono::serde::ts_seconds")]
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlogDto {
    pub title: String,
    pub content: String,
    pub creator: String,
}

impl CreateDTO<Blog> for CreateBlogDto {
    fn into_entity(self) -> Blog {
        let now = Utc::now().to_rfc3339();
        Blog {
            id: Uuid::new_v4().to_string(),
            title: self.title,
            content: self.content,
            creator: self.creator,
            created_at: now.clone(),
            updated_at: now,
        }
    }
}

#[derive(Debug, Deserialize, AsChangeset)]
#[diesel(table_name = blogs)]
pub struct UpdateBlogDto {
    pub title: Option<String>,
    pub content: Option<String>,
}

impl UpdateDTO for UpdateBlogDto {}

impl Blog {
    pub fn to_reponse(&self) -> BlogResponse {
        BlogResponse {
            id: self.id.clone(),
            title: self.title.clone(),
            content: self.content.clone(),
            creator: self.creator.clone(),
            created_at: DateTime::parse_from_rfc3339(&self.created_at)
                .unwrap()
                .with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&self.updated_at)
                .unwrap()
                .with_timezone(&Utc),
        }
    }
}
