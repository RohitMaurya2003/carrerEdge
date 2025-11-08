import Navbar from "./components/Navbar";

import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import AiLearn from "./pages/AiLearn";
import ResumeReviewer from "./pages/ResumeReviewer";
import ProgressPage from "./pages/ProgressPage"; // Added ProgressPage import
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import StudentHelper from "./pages/StudentHelper";
import MentorPage from "./pages/MentorPage";
import MenteePage from "./pages/MenteePage";
// Explicit extension helps resolver on some Windows setups

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
        <div data-theme="dim" className="pt-16">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentor-fetch" element={authUser ? <MenteePage /> : <Navigate to="/login" />} />
        <Route path="/request-fetch" element={authUser? <MentorPage/> : <Navigate to="/login"/>} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
    <Route path="/ai-learn" element={<AiLearn />} />
  <Route path="/resume-review" element={<ResumeReviewer />} />
  <Route path="/progress" element={<ProgressPage />} />
  <Route path="/subscription-success" element={<SubscriptionSuccess />} />
  <Route path="/student-helper" element={<StudentHelper />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
