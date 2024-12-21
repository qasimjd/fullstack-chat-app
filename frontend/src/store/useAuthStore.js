import { create } from "zustand";
import axiosInstance from "../api/axios.js";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:5001" : '/';


const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignin: false,
    isLogged: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // Check authentication status
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket(); // Connect to socket if the user is authenticated
        } catch (error) {
            console.log("Error in checkAuth:", error.message);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Sign-up functionality
    signup: async (data) => {
        try {
            set({ isSignin: true });
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
            get().connectSocket(); // Connect to socket after signup
        } catch (error) {
            handleAxiosError(error);
        } finally {
            set({ isSignin: false });
        }
    },

    // Login functionality
    login: async (data) => {
        try {
            set({ isLogged: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully!");
            get().connectSocket(); // Connect to socket after login
        } catch (error) {
            handleAxiosError(error);
        } finally {
            set({ isLogged: false });
        }
    },

    // Logout functionality
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            const socket = get().socket;
            if (socket) {
                socket.disconnect(); // Disconnect the socket on logout
                set({ socket: null });
            }
            set({ authUser: null, onlineUsers: [] }); // Clear state
            toast.success("Logged out successfully!");
        } catch (error) {
            console.log("Error during logout:", error.message);
        }
    },

    // Update profile functionality
    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        } catch (error) {
            handleAxiosError(error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // Connect to Socket.io server
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },

}));

// Helper function to handle Axios errors
function handleAxiosError(error) {
    if (error.response) {
        console.log("Response error:", error.response.data.message);
        toast.error(error.response.data.message);
    } else if (error.request) {
        console.log("No response received:", error.request);
        toast.error("Server is not responding. Please try again later.");
    } else {
        console.log("Error setting up request:", error.message);
        toast.error("Something went wrong. Please try again.");
    }
}

export default useAuthStore;
