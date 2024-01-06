import { Schema, Types, deleteModel, model, modelNames } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    isModified(arg0: string): unknown;
    _id: Types.ObjectId;
    email: string;
    username: string;
    name: string;
    password?: string;
    image: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    dateOfBirth?: Date;
    isOnline: boolean;
    friends?: Types.Array<Types.ObjectId>;
    followers?: Types.Array<Types.ObjectId>;
    following?: Types.Array<Types.ObjectId>;
    notifications?: Types.Array<Types.ObjectId>;
    request?: [
        {
            to: {
                _id: Types.ObjectId;
            };
            type: string;
        }
    ];
    createdAt: Date;
    updatedAt: Date;
    lastAccessed: Date;
    comparePassword(arg0: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
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
        image: {
            type: String,
            required: true,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        password: String,
        given_name: String,
        family_name: String,
        locale: String,
        dateOfBirth: Date,
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
        request: [
            {
                to: {
                    type: Schema.Types.ObjectId,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                    default: 'friend',
                },
            },
        ],
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

// Compare password
UserSchema.methods.comparePassword = async function (password: string) {
    const user = this as IUser;

    return bcrypt.compare(password, user.password!);
};

// Hash password before saving
UserSchema.pre('save', async function (next) {
    const user = this as IUser;
    if (user.isModified('password')) {
        user.password = user.password;
    }
    next();
});

const User = model<IUser>('User', UserSchema);

export default User;
