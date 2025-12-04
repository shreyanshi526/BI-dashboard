import mongoose, { Schema, Model } from 'mongoose';
import { User } from './user.model';
import { COLLECTION_NAMES } from '../../constants/collections';

const UserSchema = new Schema(
  {
    User_ID: String,
    User_Name: String,
    Company_Name: String,
    Department: String,
    Region: String,
    Is_Active_Sub: Boolean,
    Signup_Date: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.USERS,
    strict: false, // Allow fields not defined in schema
  }
);

// Indexes for better query performance
UserSchema.index({ userId: 1 });
UserSchema.index({ region: 1, department: 1 });
UserSchema.index({ isActiveSub: 1 });

export const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

