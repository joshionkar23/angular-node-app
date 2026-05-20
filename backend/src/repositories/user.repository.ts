import { CreateUserInput, UpdateUserInput, User, UserWithPassword } from "../entities/user.entity.js";
import { UserModel } from "../schemas/user.schema.js";

const mapToEntity = (doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  passwordHash?: string;
  tokenVersion?: number;
  createdAt: Date;
  updatedAt: Date;
}): User => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: (doc as any).role,
  phone: (doc as any).phone ?? null,
  address: (doc as any).address ?? null,
  profileImageUrl: (doc as any).profileImageUrl ?? null,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

const mapToUserWithPassword = (doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  passwordHash: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}): UserWithPassword => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: (doc as any).role,
  phone: (doc as any).phone ?? null,
  address: (doc as any).address ?? null,
  profileImageUrl: (doc as any).profileImageUrl ?? null,
  passwordHash: doc.passwordHash,
  tokenVersion: doc.tokenVersion,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

export class UserRepository {
  public async create(input: CreateUserInput & { passwordHash: string }): Promise<User> {
    const userDoc = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: (input as any).role ?? "user",
      phone: (input as any).phone,
      address: (input as any).address,
      profileImageUrl: (input as any).profileImageUrl
    });
    const raw = (userDoc as any).toObject ? (userDoc as any).toObject() : (userDoc as any);
    return mapToEntity(raw);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).lean();

    if (!userDoc) {
      return null;
    }

    return mapToEntity(userDoc);
  }

  public async findWithPasswordByEmail(email: string): Promise<UserWithPassword | null> {
    const userDoc = await UserModel.findOne({ email }).lean();

    if (!userDoc) {
      return null;
    }

    return mapToUserWithPassword(
      userDoc as {
        _id: { toString(): string };
        name: string;
        email: string;
        passwordHash: string;
        tokenVersion: number;
        createdAt: Date;
        updatedAt: Date;
      }
    );
  }

  public async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).lean();
    return userDoc ? mapToEntity(userDoc) : null;
  }

  public async findWithPasswordById(id: string): Promise<UserWithPassword | null> {
    const userDoc = await UserModel.findById(id).lean();

    if (!userDoc) {
      return null;
    }

    return mapToUserWithPassword(
      userDoc as {
        _id: { toString(): string };
        name: string;
        email: string;
        passwordHash: string;
        tokenVersion: number;
        createdAt: Date;
        updatedAt: Date;
      }
    );
  }

  public async updateById(
    id: string,
    updates: UpdateUserInput & { passwordHash?: string }
  ): Promise<User | null> {
    const updatePayload: {
      name?: string;
      email?: string;
      passwordHash?: string;
    } = {};

    if (updates.name !== undefined) {
      updatePayload.name = updates.name;
    }

    if (updates.email !== undefined) {
      updatePayload.email = updates.email;
    }

    if (updates.passwordHash !== undefined) {
      updatePayload.passwordHash = updates.passwordHash;
    }

    const userDoc = await UserModel.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
    return userDoc ? mapToEntity(userDoc) : null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id).lean();
    return Boolean(deleted);
  }

  public async incrementTokenVersion(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }).lean();
  }

  public async list(): Promise<User[]> {
    const userDocs = await UserModel.find().sort({ createdAt: -1 }).lean();
    return userDocs.map(mapToEntity);
  }
}
