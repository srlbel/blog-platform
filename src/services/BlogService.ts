import { BlogRepository } from "../repositories/BlogRepository";
import { Blog, NewBlog } from "../models/Blog";

export class BlogService {
    constructor(private repo: BlogRepository) { }

    getAll(): Promise<Blog[]> {
        return this.repo.getAll();
    }

    getOne(id: number): Promise<Blog | undefined> {
        return this.repo.getById(id);
    }

    create(data: NewBlog): Promise<Blog> {
        return this.repo.create(data);
    }

    delete(id: number): Promise<void> {
        return this.repo.delete(id);
    }

    update(id: number, data: Partial<NewBlog>): Promise<Blog | undefined> {
        return this.repo.update(id, data);
    }
}