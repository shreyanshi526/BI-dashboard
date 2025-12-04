import { UserRepository } from './user.repository';
import { User, CreateUserDto, UpdateUserDto, UserQueryParams } from './user.model';
import { NotFoundError, ValidationError } from '../../middleware/error.handler';
import { AppMessages } from '../../utils/app.messages';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.repository.findByUserId(userData.userId);
    if (existingUser) {
      throw new ValidationError(AppMessages.USER_ALREADY_EXISTS);
    }

    return this.repository.create(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(AppMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    return this.repository.findByUserId(userId);
  }

  async getAllUsers(query: UserQueryParams = {}): Promise<{ users: User[]; total: number }> {
    const users = await this.repository.findAll(query);
    const total = await this.repository.count(query);
    return { users, total };
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(AppMessages.USER_NOT_FOUND);
    }

    const updatedUser = await this.repository.update(id, updateData);
    if (!updatedUser) {
      throw new Error(`Failed to update user with id ${id}`);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(AppMessages.USER_NOT_FOUND);
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
  }

  async getRegions(): Promise<string[]> {
    return this.repository.getDistinctRegions();
  }

  async getDepartments(): Promise<string[]> {
    return this.repository.getDistinctDepartments();
  }
}

