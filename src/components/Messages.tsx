import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Send, User, Search } from "lucide-react";
import { mockMessages, mockTutors, mockStudentUser } from "../data/mockData";
import { Message } from "../types";

interface MessagesProps {
  userRole: "student" | "tutor";
}

export function Messages({ userRole }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>("t1");

  const currentUserId = userRole === "student" ? "student1" : "tutor1";

  // Get unique conversations
  const conversations = Array.from(
    new Set(
      messages.map(m =>
        m.senderId === currentUserId ? m.receiverId : m.senderId
      )
    )
  ).map(userId => {
    const lastMessage = messages
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

    const contact =
      userRole === "student"
        ? mockTutors.find(t => t.id === userId)
        : { id: userId, name: "Student Name", avatar: mockStudentUser.avatar };

    return {
      userId,
      name: contact?.name || "Unknown",
      avatar: contact?.avatar,
      lastMessage: lastMessage?.content || "",
      timestamp: lastMessage?.timestamp || "",
      unread: messages.filter(
        m => m.senderId === userId && m.receiverId === currentUserId && !m.read
      ).length,
    };
  });

  const currentMessages = messages
    .filter(
      m =>
        (m.senderId === selectedChat && m.receiverId === currentUserId) ||
        (m.receiverId === selectedChat && m.senderId === currentUserId)
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: `msg${messages.length + 1}`,
      senderId: currentUserId,
      receiverId: selectedChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const selectedContact = conversations.find(c => c.userId === selectedChat);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Chat with your {userRole === "student" ? "tutors" : "students"}
        </p>
      </div>

      <Card className="mt-6">
        <div className="grid grid-cols-12 h-[600px]">
          {/* Contacts List */}
          <div className="col-span-4 border-r">
            <CardHeader className="border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(600px-80px)]">
              <div className="p-2">
                {conversations.map(conv => (
                  <div
                    key={conv.userId}
                    onClick={() => setSelectedChat(conv.userId)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      selectedChat === conv.userId
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conv.avatar} alt={conv.name} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm text-gray-900 truncate">
                            {conv.name}
                          </h4>
                          {conv.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedContact?.avatar}
                        alt={selectedContact?.name}
                      />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{selectedContact?.name}</h4>
                      <p className="text-sm text-gray-500">Active now</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map(message => {
                      const isSent = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isSent
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
