import { create } from "zustand";
import axiosInstance from "../api/axios.js";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore.js";

const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUserLoadind: false,
    isMessageLoading: false,

    getUsers: async () => {
        try {
            set({ isUserLoadind: true });
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            console.log(error, 'error in getUsers');
        } finally {
            set({ isUserLoadind: false });
        }
    },

    getMessages: async (id) => {
        try {
            set({ isMessageLoading: true });
            const res = await axiosInstance.get(`/messages/${id}`);
            set({ messages: res.data });
        } catch (error) {
            console.log(error, 'error in getMessages');
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { messages, selectedUser } = get();
        try {
            const res = await axiosInstance.post(`/messages/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        }
        catch (error) {
            console.log(error, 'error in sendMessage');
            toast.error('Failed to send message');
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    // Emit an event (example: send message)
    subsribeToMessage: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMaessage) => {
            if (newMaessage.sender !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMaessage]
            });
        });
    },

    unSubscribeFromMessages: () =>{
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage')
    },

}));

export default useChatStore;