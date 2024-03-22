const generateUsernameFromEmail = ({ email }: { email: string }) => {
    const username = email.split('@')[0];

    return username;
};

export default generateUsernameFromEmail;
