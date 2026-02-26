import { BaseService } from '../services/base.service';
import type { User } from '../types/user.js';

export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }
  async findByEmail(email: string): Promise<User | null> {
    const query = ` SELECT * FROM ${this.tableName} Where email = $1`;
    const result = await this.pool.query(query, [email]);
    return result.rows.length > 0 ? result.rows.rows[0] : null;
  }
}
