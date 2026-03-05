import { BaseService } from '../../services/base.service';
import type { User } from '../types/user';

export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }
  async createUser(data: User): Promise<User> {
    const emailExists = await this.findOne({ email: data.email });
    if (emailExists) {
      throw new Error('This email has been used ');
    }
    const newUser = this.create(data);
    return newUser;
  }
  async findUser(user: Partial<User>) {
    return this.findOne(user);
  }
}
