export class BaseService<T> {
  private model: any; 

  constructor(model: any) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  // Find one 
  async findById(id: number): Promise<T | null> {
    return await this.model.findByPk(id);
  }

  // Find all 
  async findAll(): Promise<T[]> {
    return await this.model.findAll();
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const record = await this.model.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
