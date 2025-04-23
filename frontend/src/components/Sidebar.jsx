import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import useChatStore from "../store/useChatStore"
import useAuthStore from "../store/useAuthStore";

const Sidebar = () => {

    const { users, getUsers, isUserLoading, selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnline, setShowOnline] = useState(false);

    const filterUsers = showOnline ? users.filter((user) => onlineUsers.includes(user._id)) : users;

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if (isUserLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-screen w-16 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* // Sidebar Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                <div className="mt-3 hidden lg:flex items-center gap-2 ">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            className="checkbox checkbox-sm" 
                            checked={showOnline} 
                            onChange={() => setShowOnline(!showOnline)} 
                        />
                        <span className="text-sm text-zinc-400">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length-1})</span>
                </div>
            </div>

            {/* User List */}
            <div className="overflow-y-auto w-full py-3" style={{ scrollbarWidth: "none" }}>
                {filterUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
                            w-full p-3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                          `}
                    >
                        {/* Profile Picture */}
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullname}
                                className="lg:size-12 size-10 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-1 right-1 size-2 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        {/* User Info */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullname}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No users available</div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
