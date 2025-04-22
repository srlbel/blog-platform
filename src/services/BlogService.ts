import type { BlogRepository } from '../repositories/BlogRepository';
import type { Blog, NewBlog } from '../models/Blog';
import type { IService } from '../interfaces/IService';

export class BlogService implements IService<Blog, NewBlog> {
  constructor(private repo: BlogRepository) { }

  getAll(): Promise<Blog[]> {
    return this.repo.getAll();
  }

  getOne(id: string): Promise<Blog | undefined> {
    return this.repo.getById(id);
  }

  create(data: NewBlog): Promise<Blog> {
    return this.repo.create(data);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  update(id: string, data: Partial<NewBlog>): Promise<Blog | undefined> {
    return this.repo.update(id, data);
  }
}
