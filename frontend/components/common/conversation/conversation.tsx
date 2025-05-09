import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, X, Send, Paperclip } from "lucide-react";
import Image from "next/image";

export default function ConversationComponent() {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const messagesEndRef = useRef(null);

  // Plus d'historique de messages pour démontrer le défilement
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Fayssal Mechmeche",
      content: "Bonjour, comment ça va aujourd'hui ?",
      time: "09:15",
      avatar: "/api/placeholder/40/40",
      isNew: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Salut ! Ça va bien, merci. Et toi ?",
      time: "09:18",
      avatar: "/api/placeholder/40/40",
      isNew: false,
    },
    {
      id: 3,
      sender: "Fayssal Mechmeche",
      content: "Je vais bien aussi. Tu as vu le nouveau projet ?",
      time: "09:20",
      avatar: "/api/placeholder/40/40",
      isNew: false,
    },
    {
      id: 4,
      sender: "You",
      content: "Pas encore, je vais le regarder",
      time: "09:23",
      avatar: "/api/placeholder/40/40",
      isNew: false,
    },
    {
      id: 5,
      sender: "Fayssal Mechmeche",
      content: "On est mort dans le film",
      time: "11:30",
      avatar: "/api/placeholder/40/40",
      isNew: true,
    },
    {
      id: 6,
      sender: "You",
      content: "Allez BodyCount",
      time: "11:45",
      avatar: "/api/placeholder/40/40",
      isNew: false,
    },
  ]);

  // Scroll to bottom when messages change or when expanded
  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, expanded]);

  // Simule la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      if (!document.hidden) {
        markAllMessagesAsRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Simule la réception d'un nouveau message après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        sender: "Fayssal Mechmeche",
        content: "Tu as vu le dernier épisode ?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/api/placeholder/40/40",
        isNew: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      if (!isPageVisible || !expanded) {
        setHasNewMessages(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [messages, isPageVisible, expanded]);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      markAllMessagesAsRead();
    }
  };

  const markAllMessagesAsRead = () => {
    setHasNewMessages(false);
    setMessages((prev) => prev.map((msg) => ({ ...msg, isNew: false })));
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          sender: "You",
          content: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "/api/placeholder/40/40",
          isNew: false,
        },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Trouver l'index du premier message nouveau
  const firstNewMessageIndex = messages.findIndex((msg) => msg.isNew);

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

              {messages.map((msg, index) => (
                <div key={msg.id}>
                  {/* New message divider - only show before the first new message */}
                  {msg.isNew &&
                    index === firstNewMessageIndex &&
                    hasNewMessages && (
                      <div className="flex items-center justify-center my-4">
                        <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                        <span className="px-4 py-1 bg-purple-200 text-purple-700 text-sm rounded-full mx-2">
                          Nouveau
                        </span>
                        <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                      </div>
                    )}

                  {/* Message bubble */}
                  <div
                    className={`flex ${
                      msg.sender === "You" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {msg.sender !== "You" && (
                      <div className="flex items-end space-x-2">
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {msg.time}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={msg.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    )}
                    {msg.sender === "You" && (
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={msg.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {msg.time}
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
                  {hasNewMessages && (
                    <span className="text-xs text-purple-600">
                      Nouveaux messages
                    </span>
                  )}
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

              {messages.map((msg, index) => (
                <div key={msg.id}>
                  {/* New message divider - only show before the first new message */}
                  {msg.isNew &&
                    index === firstNewMessageIndex &&
                    hasNewMessages && (
                      <div className="flex items-center justify-center my-4">
                        <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                        <span className="px-4 py-1 bg-purple-200 text-purple-700 text-sm rounded-full mx-2">
                          Nouveau
                        </span>
                        <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                      </div>
                    )}

                  {/* Message bubble */}
                  <div
                    className={`flex ${
                      msg.sender === "You" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {msg.sender !== "You" && (
                      <div className="flex items-end space-x-2">
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {msg.time}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={msg.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    )}
                    {msg.sender === "You" && (
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={msg.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {msg.time}
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
