export interface IService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T | undefined>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T | undefined>;
  delete(id: string): Promise<void>;
}
