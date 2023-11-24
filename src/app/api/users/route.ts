import connectToDB from "@/services/mongoose";
import User from "@/models/User";
import logger from "@/utils/logger";

export const GET = async (request: Request) => {
  logger("API: GET ALL USERS");
  try {
    await connectToDB();
    const users = await User.find({ locale: "vi" });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(`Error ${error}`, { status: 500 });
  }
};
