import { Types } from 'mongoose';

export interface User {
  _id?: Types.ObjectId;
  userId: string;
  userName: string;
  companyName: string;
  department: string;
  region: string;
  isActiveSub: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  userId: string;
  userName: string;
  companyName: string;
  department: string;
  region: string;
  isActiveSub: boolean;
}

export interface UpdateUserDto {
  userName?: string;
  companyName?: string;
  department?: string;
  region?: string;
  isActiveSub?: boolean;
}

export interface UserQueryParams {
  region?: string;
  department?: string;
  isActiveSub?: boolean;
  limit?: number;
  skip?: number;
}

