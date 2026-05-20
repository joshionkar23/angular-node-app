import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserInput, User } from "../entities/user.entity.js";
import { env } from "../config/env.js";
import { UserRepository } from "../repositories/user.repository.js";
import { HttpError } from "../utils/http-error.js";

interface AccessTokenPayload {
  sub: string;
  email: string;
  tv: number;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  public async register(input: CreateUserInput): Promise<{ user: User; accessToken: string }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new HttpError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({ ...input, passwordHash });
    const freshUser = await this.userRepository.findWithPasswordById(user.id);

    if (!freshUser) {
      throw new HttpError(500, "Unable to load created user");
    }

    const accessToken = this.createAccessToken(freshUser.id, freshUser.email, freshUser.tokenVersion);
    return { user, accessToken };
  }

  public async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.userRepository.findWithPasswordByEmail(email);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new HttpError(401, "Invalid email or password");
    }

    const publicUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const accessToken = this.createAccessToken(user.id, user.email, user.tokenVersion);
    return { user: publicUser, accessToken };
  }

  public async logout(userId: string): Promise<void> {
    await this.userRepository.incrementTokenVersion(userId);
  }

  public async verifyAccessToken(token: string): Promise<{ userId: string; email: string }> {
    let payload: AccessTokenPayload;

    try {
      payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    } catch {
      throw new HttpError(401, "Invalid or expired token");
    }

    const user = await this.userRepository.findWithPasswordById(payload.sub);

    if (!user || user.tokenVersion !== payload.tv) {
      throw new HttpError(401, "Invalid or expired token");
    }

    return { userId: user.id, email: user.email };
  }

  public async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  private createAccessToken(userId: string, email: string, tokenVersion: number): string {
    return jwt.sign(
      { sub: userId, email, tv: tokenVersion },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
      }
    );
  }
}
