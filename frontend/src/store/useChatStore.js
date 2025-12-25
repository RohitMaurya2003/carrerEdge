import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getConnectedMentees: async () => {
    set({ isUsersLoading: true });
    try {
  const res = await api.get("/mentorship/connections"); 
      set({ users: res.data.mentees || [] });
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching connected mentees");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConnectedMentors: async () => {
    set({ isUsersLoading: true });
    try {
  const res = await api.get("/mentorship/connections"); 
      set({ users: res.data.mentors || [] });
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching connected mentees");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (receiverId) => {
    set({ isMessagesLoading: true });
    try {
  const res = await api.get(`/messages/messages/${receiverId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return toast.error("No user selected");
    try {
  const res = await api.post(`/messages/messages/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
