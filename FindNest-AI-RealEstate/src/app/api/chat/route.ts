import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { supabase as adminSupabase } from '@/lib/supabase'; // Using the old client just for DB query where RLS is not strictly needed for searching rooms, or better to use the server client.

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, chatId } = json;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Polyfill parts for older clients or when parts is omitted to prevent convertToModelMessages crash
  messages.forEach((m: any) => {
    if (!m.parts && typeof m.content === 'string') {
      m.parts = [{ type: 'text', text: m.content }];
    }
  });

  // Save user message if logged in and chatId exists
  if (user && chatId) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      await supabase.from('messages').insert({
        chat_id: chatId,
        role: 'user',
        content: lastMessage.content || ""
      });
    }
  }

  const systemInstruction = `Bạn là "Trợ lý AI FindNest", một chuyên viên môi giới phòng trọ tại Hà Nội siêu nhiệt tình, thân thiện và chuyên nghiệp. 
Nhiệm vụ của bạn là tư vấn tìm phòng cho khách hàng.
Bạn có khả năng trả lời bằng văn bản markdown (in đậm, in nghiêng, gạch đầu dòng, emoji).
Nếu khách hàng hỏi tìm phòng chung chung, hãy hỏi rõ: Quận nào? Khoảng giá bao nhiêu? Bạn đang tìm phòng trọ, chung cư mini hay nhà nguyên căn?

ĐẶC BIỆT LƯU Ý: Thay vì bảo khách tự bấm vào link bộ lọc, bạn BẮT BUỘC PHẢI DÙNG CÔNG CỤ "searchRooms" ĐỂ LỤC TÌM DATABASE!
- Gọi công cụ searchRooms với các tham số phù hợp (ví dụ: district="Đống Đa", minPrice=2000000).
- Sau khi có kết quả từ công cụ, hãy tổng hợp lại và giới thiệu 3-5 căn phòng nổi bật nhất cho khách hàng, gửi kèm ĐƯỜNG LINK CHI TIẾT CỦA TỪNG PHÒNG.
- Cú pháp link chi tiết bắt buộc là: [Tên Phòng](/phong/ID_CỦA_PHÒNG)
- Nếu không tìm thấy phòng nào, hãy xin lỗi và gợi ý khách mở rộng khoảng giá hoặc đổi quận.

Hãy luôn vui vẻ, xưng hô "mình" và "bạn", dùng nhiều emoji phù hợp và trả lời thật tự nhiên.`;

  try {
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      maxSteps: 5,
      system: systemInstruction,
      messages: await convertToModelMessages(messages),
      tools: {
        searchRooms: tool({
          description: 'Tìm kiếm phòng trọ, chung cư mini, nhà nguyên căn trong cơ sở dữ liệu dựa trên các tiêu chí (Quận, Giá, Từ khóa)',
          parameters: z.object({
            district: z.string().optional().describe('Tên quận (ví dụ: Đống Đa, Cầu Giấy, Thanh Xuân, Hai Bà Trưng...)'),
            minPrice: z.number().optional().describe('Giá tối thiểu (VNĐ)'),
            maxPrice: z.number().optional().describe('Giá tối đa (VNĐ)'),
            features: z.array(z.string()).optional().describe('Danh sách các tiện ích hoặc đặc điểm yêu cầu để tìm kiếm ngữ nghĩa (ví dụ: ["ban công", "nuôi chó mèo", "thang máy", "không chung chủ", "mới"])'),
          }),
          execute: async ({ district, minPrice, maxPrice, keyword, features }: { district?: string, minPrice?: number, maxPrice?: number, keyword?: string, features?: string[] }) => {
            let query = adminSupabase.from('rooms').select('id, title, price, area, location, district, description').order('created_at', { ascending: false });
            
            if (district) {
              query = query.ilike('district', `%${district}%`);
            }
            if (minPrice) {
              query = query.gte('price', minPrice);
            }
            if (maxPrice) {
              query = query.lte('price', maxPrice);
            }
            if (keyword) {
              query = query.ilike('title', `%${keyword}%`);
            }
            if (features && features.length > 0) {
              features.forEach(feat => {
                query = query.ilike('description', `%${feat}%`);
              });
            }
            
            const { data, error } = await query.limit(5);
            
            if (error) {
              return { error: 'Lỗi khi truy vấn database: ' + error.message };
            }
            if (!data || data.length === 0) {
              return { result: 'Không tìm thấy căn phòng nào phù hợp.' };
            }
            return { rooms: data };
          }
        })
      },
      onFinish: async (event) => {
        if (user && chatId && event.text) {
          await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'assistant',
            content: event.text
          });
        }
      }
    });

    // @ts-ignore
    return result.toUIMessageStreamResponse ? result.toUIMessageStreamResponse() : result.toTextStreamResponse();
  } catch (err) {
    console.error("Crash during streamText:", err);
    return new Response("Error", { status: 500 });
  }
}
