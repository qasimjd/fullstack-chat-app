import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import MessageSkeleton from '../components/skeleton/SkeletonMessages';

const ChatContainer = () => {
  const { selectedUser, getMessages, isMessageLoading, subsribeToMessage, unSubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const { messages } = useChatStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subsribeToMessage();
    return () => unSubscribeFromMessages();
  }, [selectedUser, getMessages, subsribeToMessage, unSubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // Ensures minimal scrolling
      });
    }
  }, [messages]);   

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div
              className="max-w-[60%] mb-1 rounded-lg chat-end bg-primary text-primary-content"
            >
              {message.media && (
                <img
                  src={message.media}
                  alt="Attachment"
                  className="sm:max-w-64 rounded-md mb-1 cursor-pointer"
                />
              )}
              {message.text && <p className='mx-3 mt-1'>{message.text}</p>}
              <div className="chat-header flex justify-end mt-1">
                <time className="text-xs opacity-90 mx-3 mb-1">
                  {message.timestamp.split("T")[1].split(".")[0].split(":").slice(0, 2).join(":")}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;