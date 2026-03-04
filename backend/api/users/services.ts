import { BaseService } from '../../services/base.service';
import type { User } from '../types/user';

export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }
  async createUser(data: User): Promise<User> {
    const newUser = this.create(data);
    return newUser;
  }
  async findUser(options: Partial<User>): Promise<User | null> {
    const users = await this.findAll(options);
    return UserService.length > 0 ? users[0] : null;
  }
}
