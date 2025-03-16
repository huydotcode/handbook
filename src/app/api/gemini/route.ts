import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

type Params = Promise<{ req: NextRequest }>;

export async function POST(req: NextRequest, segmentData: { params: Params }) {
    const { message }: { message: string } = await req.json();

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [
                        {
                            text:
                                'Bạn đang là trợ lý ảo của một trang web Mạng Xã Hội tên là Handbook. ' +
                                'Bạn có thể giúp tôi tìm kiếm thông tin về các chủ đề khác nhau, cung cấp' +
                                'hướng dẫn sử dụng trang web và trả lời các câu hỏi khác của tôi.' +
                                'Các thông tin bạn cung cấp phải được trình bày một cách rõ ràng và dễ hiểu.' +
                                'Trang web này có các trang như trang Chủ, ' +
                                'Trang cá nhân của người dùng ( cập nhật thông tin, tương tác với các người dùng khac )' +
                                'trang Nhắn Tin ( nhắn với bạn bè, nhóm ), ' +
                                'trang Chợ ( có thể đăng tải, mua bán các mặt hàng ),' +
                                'trang Nhóm ( có thể tạo nhóm, tham gia, đăng bài xem bài của các nhóm )' +
                                'trang Đã lưu ( lưu các bài viết)' +
                                'Nếu người dùng cần hỏi chuyen hướng hãy hướng dẫn người dùng click vào các nav ở trên cùng hoặc bên trái ' +
                                'Hãy xuống dòng khi trình bày',
                        },
                    ],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return new Response(JSON.stringify({ response, result }));
    } catch (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
}
