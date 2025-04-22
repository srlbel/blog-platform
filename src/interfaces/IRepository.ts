export interface IRepository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T | undefined>;
  delete(id: string): Promise<void>;
}
