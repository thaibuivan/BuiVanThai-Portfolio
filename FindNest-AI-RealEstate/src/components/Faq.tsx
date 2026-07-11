"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "FindNest AI là gì?",
    answer: "FindNest AI là nền tảng tìm kiếm và đăng tin cho thuê phòng trọ, chung cư mini, nhà nguyên căn uy tín hàng đầu tại Việt Nam. Chúng tôi kết nối trực tiếp người thuê và người cho thuê một cách nhanh chóng, minh bạch."
  },
  {
    question: "Làm thế nào để đăng tin cho thuê?",
    answer: "Rất đơn giản! Bạn chỉ cần tạo tài khoản, nhấn vào nút 'Đăng tin miễn phí' ở góc trên bên phải, điền đầy đủ thông tin, hình ảnh và giá cả của phòng. Tin đăng của bạn sẽ được duyệt và hiển thị ngay."
  },
  {
    question: "Người thuê có phải trả phí môi giới không?",
    answer: "Hoàn toàn không! FindNest AI cam kết mang đến trải nghiệm tìm phòng 'không qua trung gian'. Người thuê sẽ liên hệ trực tiếp với chủ nhà và không phải trả bất kỳ khoản phí môi giới nào."
  },
  {
    question: "Làm sao để biết tin đăng có chính xác hay không?",
    answer: "Chúng tôi có đội ngũ kiểm duyệt tin đăng và hệ thống đánh dấu 'Đã xác minh' cho các chủ nhà uy tín. Bạn nên ưu tiên xem các tin có huy hiệu này và luôn đến xem phòng trực tiếp trước khi đặt cọc."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Câu hỏi <span className="text-primary">thường gặp</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Giải đáp những thắc mắc phổ biến nhất khi sử dụng nền tảng FindNest AI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-colors duration-300 ${openIndex === index ? 'border-primary/50 shadow-md' : 'border-slate-200'}`}
            >
              <button 
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => toggleFaq(index)}
              >
                <span className={`font-bold text-[16px] pr-4 ${openIndex === index ? 'text-primary' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-blue-50' : 'bg-slate-50'}`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'text-primary rotate-180' : 'text-slate-400'}`} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-6 pt-0 text-slate-500 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
