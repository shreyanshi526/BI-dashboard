import { Types } from 'mongoose';
import { UserModel } from './user.schema';
import { User, CreateUserDto, UpdateUserDto, UserQueryParams } from './user.model';

export class UserRepository {

  async create(userData: CreateUserDto): Promise<User> {
    const user = new UserModel(userData);
    return (await user.save()).toObject();
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await UserModel.findById(id).lean();
    return this.mapUser(user);
  }

  private mapUser(doc: any): User | null {
    if (!doc) return null;
    const userId = doc.User_ID ? String(doc.User_ID) : doc.User_ID;
    return {
      _id: doc._id,
      userId: userId,
      userName: doc.User_Name,
      companyName: doc.Company_Name,
      department: doc.Department,
      region: doc.Region,
      isActiveSub: doc.Is_Active_Sub || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    } as User;
  }

  async findByUserId(userId: string): Promise<User | null> {
    const userIdStr = String(userId);
    const user = await UserModel.findOne({ User_ID: userIdStr }).lean();
    return this.mapUser(user);
  }

  async findAll(query: UserQueryParams = {}): Promise<User[]> {
    const filter: any = {};

    if (query.region) {
      filter.Region = query.region;
    }
    if (query.department) {
      filter.Department = query.department;
    }
    if (query.isActiveSub !== undefined) {
      filter.Is_Active_Sub = query.isActiveSub;
    }

    let queryBuilder = UserModel.find(filter);

    if (query.skip) {
      queryBuilder = queryBuilder.skip(query.skip);
    }
    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    const users = await queryBuilder.lean();
    return users.map(u => this.mapUser(u)).filter(u => u !== null) as User[];
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    return user as User | null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async count(query: UserQueryParams = {}): Promise<number> {
    const filter: any = {};

    if (query.region) {
      filter.Region = query.region;
    }
    if (query.department) {
      filter.Department = query.department;
    }
    if (query.isActiveSub !== undefined) {
      filter.Is_Active_Sub = query.isActiveSub;
    }

    return UserModel.countDocuments(filter);
  }

  async getDistinctRegions(): Promise<string[]> {
    const regions = await UserModel.distinct('Region');
    return regions.filter((r): r is string => typeof r === 'string');
  }

  async getDistinctDepartments(): Promise<string[]> {
    const departments = await UserModel.distinct('Department');
    return departments.filter((d): d is string => typeof d === 'string');
  }
}

