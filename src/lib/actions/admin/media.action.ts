'use server';
import { POPULATE_USER } from '@/lib/populate';
import { Media, Post } from '@/models';
import logger from '@/utils/logger';

export const fetchAllMedias = async ({
    limit,
    page,
}: {
    page: number;
    limit: number;
}) => {
    console.log('[LIB-ACTIONS] fetchAllMedias');
    try {
        const medias = await Media.find()
            .populate('creator', POPULATE_USER)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        console.log(
            '[LIB-ACTIONS] fetchAllMedias',
            medias.length,
            'medias fetched'
        );

        return JSON.parse(JSON.stringify(medias));
    } catch (error) {
        logger({
            message: 'Error fetch all medias' + error,
            type: 'error',
        });
    }
};

export const deleteMedia = async (mediaId: string) => {
    console.log('[LIB-ACTIONS] deleteMedia', mediaId);
    try {
        const media = await Media.findByIdAndDelete(mediaId);

        await Post.updateMany(
            { media: mediaId },
            { $pull: { media: mediaId } }
        );

        if (!media) {
            throw new Error('Media not found');
        }

        console.log(
            '[LIB-ACTIONS] deleteMedia',
            mediaId,
            'deleted successfully'
        );
        return media;
    } catch (error) {
        logger({
            message: 'Error deleting media: ' + error,
            type: 'error',
        });
        throw error; // Re-throw the error for further handling
    }
};
