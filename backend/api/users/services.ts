import { BaseService } from '../../services/base.service';
import type { User } from '../types/user';
import bcrypt from 'bcrypt';

export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }
  async createUser(data: User): Promise<User> {
    const emailExists = await this.findOne({ email: data.email });
    if (emailExists) {
      throw new Error('This email has been used ');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.create({ ...data, password: hashedPassword });
    return newUser;
  }

  async loginUser(email: string, password: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword as User;
  }

  async findUser(user: Partial<User>) {
    return this.findOne(user);
  }
}
