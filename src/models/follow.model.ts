import { model, models, Schema, Types } from 'mongoose';

interface IFollowsModel {
    follower: Types.ObjectId; // người theo dõi
    following: Types.ObjectId; // người được theo dõi
    createdAt: Date;
    updatedAt: Date;
}

const FollowsSchema = new Schema<IFollowsModel>(
    {
        follower: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        following: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Index
FollowsSchema.index({ follower: 1, following: 1 }, { unique: true });

FollowsSchema.pre<IFollowsModel>('save', function (next) {
    // khi tạo mới một Follows thì cập nhật folloersCount của user của người được theo dõi
    models.User.findByIdAndUpdate(
        this.following,
        { $inc: { followingCount: 1 } },
        { new: true }
    ).exec();

    next();
});

FollowsSchema.pre<IFollowsModel>('deleteOne', function (next) {
    // khi xóa một Follows thì cập nhật folloersCount của user
    models.User.findByIdAndUpdate(
        this.following,
        { $inc: { followingCount: -1 } },
        { new: true }
    ).exec();

    next();
});

const Follows =
    models.Follows || model<IFollowsModel>('Follows', FollowsSchema);

export default Follows;
