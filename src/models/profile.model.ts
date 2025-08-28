import { Schema, Types, model, models } from 'mongoose';

interface IProfileModel {
    user: Types.ObjectId;
    coverPhoto: string;
    bio: string;
    work: string;
    education: string;
    location: string;
    dateOfBirth: Date;
}

const ProfileSchema = new Schema<IProfileModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        coverPhoto: String,
        bio: String,
        work: String,
        education: String,
        location: String,
        dateOfBirth: Date,
    },
    {
        timestamps: true,
    }
);

ProfileSchema.index({ user: 1 });

const Profile =
    models.Profile || model<IProfileModel>('Profile', ProfileSchema);
export default Profile;
