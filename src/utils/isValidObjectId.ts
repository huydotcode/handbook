import mongoose from 'mongoose';

export default function isValidObjectId({ id }: { id: string }) {
    if (id.trim().length === 0) {
        return false;
    }

    if (!mongoose.isValidObjectId) {
        return false;
    }

    return true;
}
