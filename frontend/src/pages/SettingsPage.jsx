import THEMES from "../theme/theme";
import useThemeStore from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-base-100">
      <div className="flex-1 container mx-auto px-4 pt-6 sm:pt-10 w-full max-w-5xl">
        <div className="space-y-6 h-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
          </div>
          
          {/* Themes Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 overflow-hidden">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>

          {/* Preview Section */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-lg">
            <div className="flex-1 p-4 bg-base-200">
              {/* Mock Chat UI */}
              <div className="flex-1 bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      JD
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Qasim JD</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 space-y-4 bg-base-100 overflow-auto">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "flex-row-reverse" : "flex-row"} mb-4 items-center`}
                    >
                      {/* Profile Picture */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center text-xs text-gray-500">
                        {message.isSent ? "Q" : "L"}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[60%] px-3 py-2 rounded-lg ${message.isSent
                            ? "chat-end bg-primary text-primary-content"
                            : "chat-end bg-primary text-primary-content"
                          } ${message.isSent ? "mr-2" : "ml-2"}`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;