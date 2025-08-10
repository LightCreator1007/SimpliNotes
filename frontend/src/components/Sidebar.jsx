import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus, Search, X, Clock, Edit3 } from "lucide-react";
import apiClient from "../utils/apiClient.js";

export default function Sidebar({ setNote }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient("/notes/", { method: "GET" });
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "Untitled";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="h-4/5 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md ml-2 mt-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notes
          </h2>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </button>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Recent Notes ({notes.length})
          </h3>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Loading notes...
              </span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load notes: {error}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                No notes yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Create your first note to get started
              </p>
            </div>
          )}
          {!loading && !error && notes.length > 0 && (
            <ul className="space-y-1">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    onClick={() => setNote(note)}
                    className="w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {note.heading || "Untitled"}
                        </h4>
                        {note.content && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {truncateText(note.content, 60)}
                          </p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(note.updatedAt || note.createdAt)}
                        </div>
                      </div>
                      <Edit3 className="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>SimpliNotes</span>
          <span>{notes.length} notes</span>
        </div>
      </div>
    </div>
  );
}
