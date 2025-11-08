import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";

export const useMentorStore = create((set) => ({
  pendingRequests: [],
  isFetching: false,

  fetchPendingRequests: async () => {
    set({ isFetching: true });
    try {
  const res = await api.get("/mentorship/pending-requests");
      set({ pendingRequests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching pending requests");
    } finally {
      set({ isFetching: false });
    }
  },

  acceptRequest: async (menteeId) => {
    try {
  await api.post(`/mentorship/accept/${menteeId}`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.mentee._id !== menteeId),
      }));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  },

  rejectRequest: async (menteeId) => {
    try {
  await api.post(`/mentorship/reject/${menteeId}`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.mentee._id !== menteeId),
      }));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  },

}));