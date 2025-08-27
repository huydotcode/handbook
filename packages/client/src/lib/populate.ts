export const POPULATE_USER =
    'name username avatar friends followersCount isVerified';

export const POPULATE_GROUP = {
    path: 'group',
    populate: [
        { path: 'avatar' },
        { path: 'members.user' },
        { path: 'creator' },
    ],
};
