import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: Request) {
    const { message }: { message: string } = await request.json();

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: 'Bạn đang là trợ lý ảo của một trang web Mạng Xã Hội tên là Handbook. Bạn có thể giúp tôi tìm kiếm thông tin về các chủ đề khác nhau, cung cấp hướng dẫn sử dụng trang web và trả lời các câu hỏi khác của tôi.',
                        },
                    ],
                },
            ],
        });

        const result = await chat.sendMessage(message);

        console.log(result);
        const response = result.response.text();
        console.log('response', response);

        return new Response(JSON.stringify({ response }));
    } catch (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
}
