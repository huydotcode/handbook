export const splitName = (
    fullName: string
): { firstName: string; lastName: string } => {
    const splitNames = fullName.split(' ');
    const firstName = splitNames[0];
    const lastName = splitNames[splitNames.length - 1];
    return {
        firstName,
        lastName,
    };
};
