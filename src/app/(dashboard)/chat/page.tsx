'use client';
import { useState } from 'react';
import { RightNavbar, NavTab } from '@/components/chat/RightNavbar';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ProfilePanel } from '@/components/profile/ProfilePanel';

export default function ChatPage() {
  const [navTab, setNavTab] = useState<NavTab>('messages');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatUser, setChatUser] = useState<any | null>(null);

  const handleSelectChat = (id: string, user: any) => {
    setActiveChat(id);
    setChatUser(user);
    setNavTab('messages');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Left sidebar — conversation list */}
      <ChatSidebar
        activeTab={navTab}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
      />

      {/* Center — chat window */}
      <ChatWindow chatId={activeChat} chatUser={chatUser} />

      {/* Right — profile panel */}
      <ProfilePanel user={chatUser} />

      {/* Far right — icon navbar */}
      <RightNavbar activeTab={navTab} onTabChange={setNavTab} />
    </div>
  );
}
