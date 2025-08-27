import {
    getLocations,
    getProfileByUserId,
    getProfilePicturesAction,
    updateAvatar,
    updateBio,
    updateCoverPhoto,
    updateInfo,
} from '../actions/profile.action';

interface IProfileService {
    getByUserId(userId: string): Promise<IProfile | null>;
    updateBio({
        newBio,
        path,
        userId,
    }: {
        userId: string;
        newBio: any;
        path: string;
    }): Promise<boolean>;
    getProfilePicturesAction: (userId: string) => Promise<IMedia[]>;

    updateInfo: ({
        profileId,
        dateOfBirth,
        education,
        location,
        work,
        path,
    }: {
        profileId: string;
        work: string;
        education: string;
        location: string;
        dateOfBirth: Date;
        path: string;
    }) => Promise<boolean>;

    getLocations: () => Promise<ILocation[]>;

    updateAvatar: ({
        userId,
        avatar,
        path,
    }: {
        userId: string;
        avatar: string;
        path: string;
    }) => Promise<boolean>;

    updateCoverPhoto?: ({
        userId,
        coverPhoto,
        path,
    }: {
        userId: string;
        coverPhoto: string;
        path: string;
    }) => Promise<boolean>;
}

class ProfileServiceClass implements IProfileService {
    async getByUserId(userId: string): Promise<IProfile | null> {
        const profile = await getProfileByUserId({
            query: userId,
        });
        return profile;
    }

    async updateBio({
        newBio,
        path,
        userId,
    }: {
        userId: string;
        newBio: any;
        path: string;
    }): Promise<boolean> {
        const result = await updateBio({
            newBio,
            path,
            userId,
        });
        return result;
    }

    async getProfilePicturesAction(userId: string): Promise<IMedia[]> {
        const images = await getProfilePicturesAction({ userId });
        return images;
    }

    async updateInfo({
        profileId,
        dateOfBirth,
        education,
        location,
        work,
        path,
    }: {
        profileId: string;
        work: string;
        education: string;
        location: string;
        dateOfBirth: Date;
        path: string;
    }): Promise<boolean> {
        const result = await updateInfo({
            profileId,
            dateOfBirth,
            education,
            location,
            work,
            path,
        });
        return result;
    }

    async getLocations(): Promise<ILocation[]> {
        const locations = await getLocations();
        return locations;
    }

    async updateAvatar({
        userId,
        avatar,
        path,
    }: {
        userId: string;
        avatar: string;
        path: string;
    }): Promise<boolean> {
        const result = await updateAvatar({
            userId,
            avatar,
            path,
        });
        return result;
    }

    async updateCoverPhoto({
        userId,
        coverPhoto,
        path,
    }: {
        userId: string;
        coverPhoto: string;
        path: string;
    }): Promise<boolean> {
        const result = await updateCoverPhoto({
            userId,
            coverPhoto,
            path,
        });
        return result;
    }
}

const ProfileService = new ProfileServiceClass();
export default ProfileService;
