import User from "@/models/User";
import connectToDB from "@/services/mongoose";
import logger from "@/utils/logger";

export const GET = async (req: Request, { params }: Params) => {
  logger("API: SEARCH");
  const [name] = params.query;

  try {
    await connectToDB();

    const users = await User.find({}).limit(10);

    const usersHasQuery = users.filter((user) =>
      user.name.toLocaleLowerCase().includes(name)
    );

    const searchResultUser = usersHasQuery.flatMap((user) => {
      return {
        id: user._id,
        name: user.name,
        avatar: user.image,
      };
    });

    return new Response(JSON.stringify(searchResultUser), { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
};
