import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const ChatPage = () => {
  const { selectedUser, getConnectedMentees, getConnectedMentors } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser?.role === "mentor") {
      getConnectedMentees();
    } else if (authUser?.role === "mentee") {
      getConnectedMentors();
    }
  }, [authUser?.role]);

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className=" rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
