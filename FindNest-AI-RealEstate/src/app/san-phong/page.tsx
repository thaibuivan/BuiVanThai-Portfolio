// @ts-nocheck
"use client";

import { useChat } from '@ai-sdk/react';
import { Bot, Send, User, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { messages, status, sendMessage } = useChat({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', content: input });
    setInput("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="pt-[72px] h-screen bg-slate-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 md:px-6 shrink-0 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
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
  );
}
