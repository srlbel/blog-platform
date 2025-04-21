export interface IService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
    getAll(): Promise<T[]>;
    getOne(id: number): Promise<T | undefined>;
    create(data: CreateDto): Promise<T>;
    update(id: number, data: UpdateDto): Promise<T | undefined>;
    delete(id: number): Promise<void>;
}