import {
    Schema,
    Types,
    deleteModel,
    model,
    modelNames,
    models,
} from 'mongoose';
import * as bcrypt from 'bcrypt';

interface IUserModel {
    isModified(arg0: string): unknown;
    name: string;
    username: string;
    email: string;
    avatar: string;
    password: string;
    role: string;
    givenName: string;
    familyName: string;
    locale: string;
    friends: Types.ObjectId[];
    followersCount: number;
    isOnline: boolean;
    isBlocked: boolean;
    lastAccessed: Date;
    comparePassword(arg0: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserModel>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        password: String,
        givenName: String,
        familyName: String,
        locale: String,
        friends: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        followersCount: {
            type: Number,
            default: 0,
        },
        lastAccessed: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
);

if (modelNames && modelNames().includes('User')) {
    deleteModel('User');
}

UserSchema.methods.comparePassword = async function (password: string) {
    const user = this as IUserModel;
    if (user.password === undefined) {
        return false;
    }
    return bcrypt.compare(password, user.password!);
};

UserSchema.pre('save', async function (next) {
    const user = this as IUserModel;
    if (user.isModified('password')) {
        user.password = user.password;
    }
    next();
});

const User = models.user || model<IUserModel>('user', UserSchema);

export default User;
