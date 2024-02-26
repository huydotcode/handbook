import { Schema, Types, model, models } from 'mongoose';

interface IProfile {
    userId: Types.ObjectId;
    username?: string;
    coverPhoto?: string;
    profilePicture?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    work?: string;
    education?: string;
    location?: string;
    relationship?: string;
    website?: string;
    date?: Date;
}

const ProfileSchema = new Schema<IProfile>(
    {
        username: {
            type: String,
            unique: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        coverPhoto: String,
        profilePicture: String,
        bio: String,
        work: String,
        education: String,
        location: String,
        relationship: String,
        website: String,
        date: Date,
    },
    {
        timestamps: true,
    }
);

const Profile = models.Profile || model<IProfile>('Profile', ProfileSchema);
export default Profile;
