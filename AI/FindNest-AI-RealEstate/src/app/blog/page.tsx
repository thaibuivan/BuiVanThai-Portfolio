import Link from "next/link";
import { Calendar, User, ChevronRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Kinh nghiệm thuê phòng trọ giá rẻ nhưng an ninh tại Hà Nội",
    excerpt: "Tìm phòng trọ giá rẻ ở Hà Nội không khó, nhưng làm sao để vừa rẻ vừa đảm bảo an ninh? Dưới đây là những kinh nghiệm xương máu từ các bạn sinh viên đi trước.",
    image: "https://images.unsplash.com/photo-1522771731470-a1a905373944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "10/10/2023",
    author: "Admin"
  },
  {
    id: 2,
    title: "Hợp đồng thuê nhà: 5 điều khoản bắt buộc phải chú ý trước khi ký",
    excerpt: "Đừng vội đặt bút ký hợp đồng khi bạn chưa đọc kỹ 5 điều khoản quan trọng này. Tránh mất tiền oan và những tranh chấp không đáng có với chủ nhà.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "05/10/2023",
    author: "Luật sư Minh"
  },
  {
    id: 3,
    title: "Top 5 quận có giá thuê chung cư mini rẻ nhất Hà Nội hiện nay",
    excerpt: "Bạn đang tìm thuê chung cư mini tại Hà Nội? Tham khảo ngay danh sách 5 quận có mức giá thuê tốt nhất, giao thông thuận tiện cho người đi làm.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "01/10/2023",
    author: "FindNest AI Team"
  }
];

export default function BlogPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1320px] text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Góc chia sẻ & Kinh nghiệm</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Những bài viết hữu ích về thị trường bất động sản cho thuê, mẹo tìm phòng và kiến thức pháp lý.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1320px] mt-12 md:-mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full z-10 relative">
              <div className="aspect-video w-full overflow-hidden relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                <Link href="#" className="inline-flex items-center text-primary font-bold hover:text-blue-800 transition-colors mt-auto">
                  Đọc tiếp <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
