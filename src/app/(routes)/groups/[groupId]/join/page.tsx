interface Props {
    params: Promise<{ groupId: string }>;
}

const JoinGroupPage: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;

    return (
        <div>
            <h1>Join Group</h1>
        </div>
    );
};

export default JoinGroupPage;
