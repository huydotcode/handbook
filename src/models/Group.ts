import { Schema, model, models } from 'mongoose';

interface IGroup {
    name: string;
    description: string;
    image: string;
    members: Schema.Types.ObjectId[];
    owner: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        members: {
            type: [Schema.Types.ObjectId],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Group = models.Group || model<IGroup>('Group', GroupSchema);
export default Group;
