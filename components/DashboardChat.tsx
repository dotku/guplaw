'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  initialConversations: ConversationSummary[];
}

export default function DashboardChat({ initialConversations }: Props) {
  const [conversations, setConversations] =
    useState<ConversationSummary[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = useCallback(async (id: string) => {
    setActiveId(id);
    setMessages([]);
    try {
      const res = await fetch(`/api/dashboard/conversations/${id}`);
      if (!res.ok) throw new Error('Failed to load conversation');
      const data = await res.json();
      setMessages(
        (data.messages ?? []).map((m: ChatMessage) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setInput('');
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      if (!confirm('Delete this conversation? This cannot be undone.')) return;
      try {
        await fetch(`/api/dashboard/conversations/${id}`, { method: 'DELETE' });
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeId === id) {
          startNewChat();
        }
      } catch (err) {
        console.error(err);
      }
    },
    [activeId, startNewChat],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/dashboard/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, content }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Chat request failed');
      }

      setIsStreaming(true);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let streamedConversationId = activeId;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.conversationId && !streamedConversationId) {
              streamedConversationId = parsed.conversationId;
              setActiveId(parsed.conversationId);
            }
            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }

      // Refresh conversation list (new title, ordering).
      try {
        const listRes = await fetch('/api/dashboard/conversations');
        if (listRes.ok) {
          const data = await listRes.json();
          setConversations(data.conversations ?? []);
        }
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Dashboard chat error:', err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            'Sorry, something went wrong sending your message. Please try again.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6 h-[calc(100vh-11rem)] min-h-[520px]">
      {/* Conversation list */}
      <aside className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <button
            type="button"
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-bold px-4 py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6 px-3">
              No conversations yet. Start chatting to create your first one.
            </p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((conv) => (
                <li
                  key={conv.id}
                  className={`group flex items-center gap-2 rounded-lg transition-colors ${
                    activeId === conv.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => loadConversation(conv.id)}
                    className="flex-1 text-left px-3 py-2 text-sm truncate"
                  >
                    <span className="font-semibold text-gray-900 block truncate">
                      {conv.title}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteConversation(conv.id)}
                    aria-label="Delete conversation"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-2 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Chat */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold truncate">Richard AI legal assistant</h3>
            <p className="text-blue-100 text-xs">
              {isStreaming ? 'Processing...' : 'Your private chat — history is saved'}
            </p>
          </div>
        </div>

        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.84 8.84 0 01-3.075-.538A4.99 4.99 0 012 17l1.4-3.5A6.44 6.44 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-700">
                {activeId ? 'Loading conversation...' : 'Ask Richard anything'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Family law, housing, immigration, crypto — your history is private to you.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={m.id ?? i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-800'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none leading-relaxed">
                      {m.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 border-t-2 border-gray-200 bg-white"
        >
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your legal question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-bold px-5 sm:px-6 py-3 rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            General legal information, not legal advice. Escalate to a licensed attorney for specific matters.
          </p>
        </form>
      </section>
    </div>
  );
}
