import React from 'react'
import { useChatStore } from '../store/useChatStore'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';

// Temporary placeholder components to prevent crashes
const ProfileHeader = () => <div className="p-4 text-white">Profile Header</div>;
const ActiveTabSwitch = () => <div className="p-4 text-white">Tab Switch</div>;
const ChatsList = () => <div className="text-white">Chats List</div>;
const ContactsList = () => <div className="text-white">Contacts List</div>;
const ChatContainer = () => <div className="text-white p-4">Chat Container</div>;
const NoConversationPlaceholder = () => <div className="text-white p-4 text-center">Select a conversation</div>;

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="flex h-full">
          {/*  Left Side */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />} 
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage
