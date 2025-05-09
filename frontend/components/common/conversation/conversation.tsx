import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, X, Send, Paperclip } from "lucide-react";
import Image from "next/image";
import {
  Conversation as ConversationInterface,
  Message,
  User,
} from "@/lib/interfaces";
import { sendMessage } from "@/actions/conversations";
import { getCurrentUser } from "@/actions/auth";
export default function ConversationComponent({
  conversation,
}: {
  conversation: ConversationInterface;
}) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (conversation.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, expanded]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        senderId: user?.id || "",
        receiverId: conversation.receiverId,
        conversationId: conversation.id,
        //documentId:
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      sendMessage(newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      {expanded ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl flex flex-col w-2/3 h-3/4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/api/placeholder/40/40"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-medium">Conversation</span>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages with scroll */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-4 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${
                      msg.senderId === conversation.senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.senderId !== conversation.senderId && (
                      <div className="flex items-end space-x-2">
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    )}
                    {msg.senderId === conversation.senderId && (
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Invisible element for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center p-3 border-t">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-3 py-2 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex flex-col rounded-lg shadow-lg bg-white overflow-hidden w-full h-[745px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/api/placeholder/40/40"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Conversation</span>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Agrandir"
              >
                <ArrowUpRight size={20} />
              </button>
            </div>

            {/* Messages (mini version with scroll) */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-4 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${
                      msg.senderId === conversation.senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.senderId !== conversation.senderId && (
                      <div className="flex items-end space-x-2">
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    )}
                    {msg.senderId === conversation.senderId && (
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Invisible element for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center p-3 border-t">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-3 py-2 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
