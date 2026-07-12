// @ts-nocheck
"use client";

import { useChat } from '@ai-sdk/react';
import { Bot, Send, User, ArrowLeft, Sparkles, MessageSquare, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/lib/supabase/client';

export default function ChatPage() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const { messages, status, append, setMessages } = useChat({
    body: { chatId },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Chào bạn! 👋 Mình là Trợ lý AI của FindNest. Bạn đang muốn tìm phòng trọ ở khu vực nào, tài chính khoảng bao nhiêu nhỉ?'
      }
    ]
  });

  const [input, setInput] = useState("");
  const isLoading = status === 'in_progress' || status === 'submitted';

  useEffect(() => {
    const supabase = createClient();

    const loadData = async (currentSession: any) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setChatHistory(data);
        }
      } else {
        setChatHistory([]);
      }
      setIsLoadingHistory(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadData(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadData(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let activeChatId = chatId;
    const supabase = createClient();

    // If logged in and no active chat, create one
    if (session?.user && !activeChatId) {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: session.user.id,
          title: input.substring(0, 30) + (input.length > 30 ? '...' : '') // simple title
        })
        .select()
        .single();
      
      if (data) {
        activeChatId = data.id;
        setChatId(data.id);
        setChatHistory([data, ...chatHistory]);
      }
    }

    // Call append, we don't need to pass body explicitly in append because useChat handles it,
    // BUT we just updated `chatId` state. useChat body might not update synchronously.
    // However, @ai-sdk/react useChat automatically picks up the latest `body` reference on submit.
    append({ role: 'user', content: input }, { body: { chatId: activeChatId }});
    setInput("");
  };

  const loadChat = async (id: string) => {
    setChatId(id);
    const supabase = createClient();
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });
    
    if (data && data.length > 0) {
      // Map to ai-sdk format
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content
      })));
    } else {
      setMessages([]);
    }
  };

  const startNewChat = () => {
    setChatId(null);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chào bạn! 👋 Mình là Trợ lý AI của FindNest. Bạn đang muốn tìm phòng trọ ở khu vực nào, tài chính khoảng bao nhiêu nhỉ?'
      }
    ]);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="pt-[72px] h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Sidebar */}
      <div className={`w-72 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shrink-0 ${isSidebarOpen ? 'ml-0' : '-ml-72'}`}>
        <div className="p-4">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" /> Đoạn chat mới
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Lịch sử của bạn</p>
          
          {isLoadingHistory ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>
          ) : !session ? (
            <div className="text-sm text-slate-400 px-2 py-4 text-center">
              Vui lòng <Link href="/dang-nhap" className="text-blue-400 hover:underline">Đăng nhập</Link> để lưu lịch sử chat.
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="text-sm text-slate-500 px-2">Chưa có lịch sử chat nào.</div>
          ) : (
            chatHistory.map(chat => (
              <button 
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${chatId === chat.id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm font-medium">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-4 z-20 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 text-slate-600 hidden md:flex"
        >
          <ArrowLeft className={`w-5 h-5 transition-transform ${!isSidebarOpen && 'rotate-180'}`} />
        </button>

        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-4 md:px-16 shrink-0 flex items-center justify-between shadow-sm z-10 h-[72px]">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-tight">Trợ lý AI FindNest</h1>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Đang trực tuyến
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(m => (
              <div key={m.id} className={`flex gap-3 md:gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                }`}>
                  <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : ''}`}>
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a 
                            {...props} 
                            className="inline-block mt-2 px-4 py-2 bg-blue-50 border border-blue-100 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        )
                      }}
                    >
                      {/* @ts-ignore */}
                      {m.parts?.filter(p => p.type === 'text').map(p => p.text).join('') || m.content || ""}
                    </ReactMarkdown>

                    {/* Render Tool Invocations for visibility */}
                    {/* @ts-ignore */}
                    {m.toolInvocations && m.toolInvocations.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {/* @ts-ignore */}
                        {m.toolInvocations.map((tool: any) => (
                          <div key={tool.toolCallId} className="text-xs text-slate-600 bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex items-center gap-2.5">
                            {tool.state === 'call' ? (
                              <div className="w-3.5 h-3.5 rounded-full border-[2px] border-primary border-t-transparent animate-spin shrink-0"></div>
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <span className="font-medium">
                              {tool.state === 'call' ? 'Đang lục tìm dữ liệu phòng trống...' : 'Đã tải xong dữ liệu phòng từ hệ thống!'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white border-t border-slate-200 p-4 shrink-0 pb-8 md:pb-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <input
              value={input || ""}
              onChange={handleInputChange}
              placeholder="Nhập yêu cầu tìm phòng của bạn..."
              className="w-full h-14 pl-6 pr-14 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input?.trim()}
              className="absolute right-2 w-10 h-10 bg-primary hover:bg-blue-700 disabled:bg-slate-300 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
