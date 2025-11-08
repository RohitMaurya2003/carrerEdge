import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useMenteeStore = create((set, get) => ({
  mentors: [],
  isLoading: false,

  fetchMentors: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/mentorship/mentors");
      set({ mentors: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching mentors");
    } finally {
      set({ isLoading: false });
    }
  },

  requestMentorship: async (mentorId) => {
    try {
      await axiosInstance.post(`/mentorship/request/${mentorId}`);
      toast.success("Mentorship request sent");
      set({
        mentors: get().mentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, status: "pending" } : mentor
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    }
  },

  cancelRequest: async (mentorId) => {
    try {
      await axiosInstance.delete(`/mentorship/cancel/${mentorId}`);
      toast.success("Mentorship request canceled");
      set({
        mentors: get().mentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, status: "not_followed" } : mentor
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error canceling request");
    }
  },
}));