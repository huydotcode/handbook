import { UserRole } from "../enums/UserRole";

export interface IUser {
  _id: string;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  role: UserRole;
  givenName?: string;
  familyName?: string;
  locale?: string;
  friends: string[]; // Changed from Types.ObjectId[]
  groups: string[]; // Changed from Types.ObjectId[]
  followersCount: number;
  isOnline: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  lastAccessed: string; // Changed from Date
  createdAt: string; // From timestamps
  updatedAt: string; // From timestamps
}
