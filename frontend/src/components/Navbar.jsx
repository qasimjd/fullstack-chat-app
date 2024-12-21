import React from 'react';
import { LogOut, MessageSquare, Settings, User, Home } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  // Check if the current path is "/settings" or "/profile"
  const isSettingsPage = location.pathname === '/settings';
  const isProfilePage = location.pathname === '/profile';

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Talk-Q</h1>
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
            {/* Conditional Home or Settings Button */}
            {isSettingsPage ? (
              <Link to="/"
                className="btn btn-sm gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            ) : (
              <Link to="/settings"
                className="btn btn-sm gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            )}

            {authUser && (
              <>
                {/* Conditional Home or Profile Button */}
                {isProfilePage ? (
                  <Link to="/"
                    className="btn btn-sm gap-2 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                ) : (
                  <Link to="/profile" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                )}

                {/* Logout */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
