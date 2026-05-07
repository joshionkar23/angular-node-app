import bcrypt from "bcrypt";
import { CreateUserInput, UpdateUserInput, User } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import { HttpError } from "../utils/http-error.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  public async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new HttpError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    return this.userRepository.create({ ...input, passwordHash });
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  public async updateUser(id: string, updates: UpdateUserInput): Promise<User> {
    if (updates.email) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new HttpError(409, "Email is already registered");
      }
    }

    const passwordHash = updates.password ? await bcrypt.hash(updates.password, 10) : undefined;
    const updatedUser = await this.userRepository.updateById(id, { ...updates, passwordHash });

    if (!updatedUser) {
      throw new HttpError(404, "User not found");
    }

    return updatedUser;
  }

  public async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new HttpError(404, "User not found");
    }
  }

  public async listUsers(): Promise<User[]> {
    return this.userRepository.list();
  }
}
