import { pick } from "lodash";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(private readonly userCreator: UserRegistry) {}

  async createUser(user: CreateUserParams): Promise<void> {
    return await this.userCreator.createUser(user);
  }

  async findByUsernameAndPassword(
    params: UsernameAndPasswordParams
  ): Promise<User | null> {
    return await this.userCreator.findByUsernameAndPassword(params);
  }
}

export interface UserRegistry {
  findByUsernameAndPassword(
    params: UsernameAndPasswordParams
  ): Promise<User | null>;
  createUser(user: CreateUserParams): Promise<void>;
}

export class User {
  username!: string;
  hashedPassword!: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
}

export interface UsernameAndPasswordParams {
  username: string;
  password: string;
}

export class InMemoryUserRegistry implements UserRegistry {
  private users: Record<string, User>;
  constructor() {
    this.users = {};
  }

  async createUser(createUser: CreateUserParams): Promise<void> {
    if (this.users[createUser.username]) {
      throw new UsernameTakenException(
        `Username ${createUser.username} already taken`
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUser.password, salt);
    this.users[createUser.username] = {
      ...pick(createUser, ["username"]),
      hashedPassword: hash,
    };
  }

  async findByUsernameAndPassword(
    params: UsernameAndPasswordParams
  ): Promise<User | null> {
    if (!this.users[params.username]) {
      throw new UserNotFoundException(`User not found`);
    }
    const user = this.users[params.username];
    if (await bcrypt.compare(params.password, user.hashedPassword)) {
      return user;
    }
    return null;
  }

  __withUnderlyingStore(fn: (store: Record<string, User>) => void): void {
    fn(this.users);
  }
}

export class UsernameTakenException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundException extends Error {
  constructor(message: string) {
    super(message);
  }
}
