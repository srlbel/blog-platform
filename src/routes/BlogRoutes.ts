import { Hono } from "hono";
import { BlogRepository } from "../repositories/BlogRepository";
import { BlogService } from "../services/BlogService";
import { BlogController } from "../controllers/BlogController";

const repo = new BlogRepository();
const service = new BlogService(repo);
const controller = new BlogController(service);

export default controller.getRoutes();