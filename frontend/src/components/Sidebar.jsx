// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FileText, Plus, Search, X, Clock, Edit3 } from "lucide-react";
// import { useAppStore } from "../store";

// export default function Sidebar({ setNote }) {
//   const { notes, loading, error, fetchNotes, createNote } = useAppStore();

//   useEffect(() => {
//     fetchNotes();
//   }, [fetchNotes]);

//   const handleCreateNote = () => {
//     createNote({ heading: "Untitled", content: "" });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Today";
//     if (diffDays === 2) return "Yesterday";
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const truncateText = (text, maxLength = 40) => {
//     if (!text) return "Untitled";
//     return text.length > maxLength
//       ? text.substring(0, maxLength) + "..."
//       : text;
//   };

//   return (
//     <div className="h-4/5 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md ml-2 mt-6">
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             Notes
//           </h2>
//         </div>
//       </div>

//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <button
//           className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
//           onClick={handleCreateNote}
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           New Note
//         </button>

//         <div className="mt-3 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search notes..."
//             className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-3">
//           <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//             Recent Notes ({notes.length})
//           </h3>
//           {loading && (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
//               <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
//                 Loading notes...
//               </span>
//             </div>
//           )}
//           {error && (
//             <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//               <p className="text-sm text-red-600 dark:text-red-400">
//                 Failed to load notes: {error}
//               </p>
//             </div>
//           )}

//           {!loading && !error && notes.length === 0 && (
//             <div className="text-center py-8">
//               <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                 No notes yet
//               </p>
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 Create your first note to get started
//               </p>
//             </div>
//           )}
//           {!loading && !error && notes.length > 0 && (
//             <ul className="space-y-1">
//               {notes.map((note) => (
//                 <li key={note._id}>
//                   <button
//                     onClick={() => setNote(note)}
//                     className="w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                           {note.heading || "Untitled"}
//                         </h4>
//                         {note.content && (
//                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
//                             {truncateText(note.content, 60)}
//                           </p>
//                         )}
//                         <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
//                           <Clock className="w-3 h-3 mr-1" />
//                           {formatDate(note.updatedAt || note.createdAt)}
//                         </div>
//                       </div>
//                       <Edit3 className="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
//                     </div>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//           <span>SimpliNotes</span>
//           <span>{notes.length} notes</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  Search,
  X,
  Clock,
  Edit3,
  Check,
  Trash2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useAppStore } from "../store";

export default function Sidebar({ setNote }) {
  const {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [showOptionsForNote, setShowOptionsForNote] = useState(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const editInputRef = useRef(null);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingNoteId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingNoteId]);

  // Filter notes based on search
  const filteredNotes = searchQuery
    ? notes.filter((note) => {
        const title = note.heading || note.title || "Untitled";
        const content = note.content || "";
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : notes;

  // Create new note
  const handleCreateNote = async () => {
    setIsCreatingNote(true);
    try {
      const newNote = {
        heading: "New Note",
        title: "New Note",
        content: "# New Note\n\nStart writing here...",
      };

      await createNote(newNote);

      // Refresh notes list
      await fetchNotes();

      // Select and open the new note (should be first in the list)
      setTimeout(() => {
        if (notes.length > 0) {
          const newestNote = notes[0];
          handleNoteClick(newestNote);
          // Start editing title immediately
          startEditingTitle(newestNote);
        }
      }, 100);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsCreatingNote(false);
    }
  };

  // Handle note click
  const handleNoteClick = (note) => {
    if (editingNoteId === note._id) return; // Don't select if editing

    setSelectedNoteId(note._id);
    setNote(note);
    setShowOptionsForNote(null);
  };

  // Start editing title
  const startEditingTitle = (note) => {
    setEditingNoteId(note._id);
    setEditingTitle(note.heading || note.title || "Untitled");
    setShowOptionsForNote(null);
  };

  // Save edited title
  const handleSaveTitle = async () => {
    if (editingNoteId && editingTitle.trim()) {
      try {
        await updateNote(editingNoteId, {
          heading: editingTitle.trim(),
          title: editingTitle.trim(),
        });

        // Update the selected note if it's the one being edited
        if (selectedNoteId === editingNoteId) {
          const updatedNote = notes.find((n) => n._id === editingNoteId);
          if (updatedNote) {
            setNote({
              ...updatedNote,
              heading: editingTitle.trim(),
              title: editingTitle.trim(),
            });
          }
        }

        // Refresh notes to show updated title
        fetchNotes();
      } catch (err) {
        console.error("Failed to update note title:", err);
      }
    }
    setEditingNoteId(null);
    setEditingTitle("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingTitle("");
  };

  // Handle key press in edit input
  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);

        // Clear selection if deleted note was selected
        if (selectedNoteId === noteId) {
          setSelectedNoteId(null);
          setNote(null);
        }

        setShowOptionsForNote(null);

        // Refresh notes list
        fetchNotes();
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  // Toggle options menu
  const toggleOptions = (noteId, e) => {
    e.stopPropagation();
    setShowOptionsForNote(showOptionsForNote === noteId ? null : noteId);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  // Truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    const cleanText = text.replace(/^#\s*/, "").replace(/\n/g, " ").trim();
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  return (
    <div className="h-4/5 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md ml-2 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notes
          </h2>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateNote}
          disabled={isCreatingNote}
        >
          {isCreatingNote ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </>
          )}
        </button>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {searchQuery
              ? `Search Results (${filteredNotes.length})`
              : `Recent Notes (${notes.length})`}
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

          {!loading && !error && filteredNotes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {searchQuery ? "No notes found" : "No notes yet"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </p>
            </div>
          )}

          {!loading && !error && filteredNotes.length > 0 && (
            <ul className="space-y-1">
              {filteredNotes.map((note) => (
                <li key={note._id} className="relative">
                  <div
                    onClick={() => handleNoteClick(note)}
                    className={`w-full p-3 rounded-lg transition-colors duration-200 text-left group cursor-pointer
                      ${
                        selectedNoteId === note._id
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Title - Editable */}
                        {editingNoteId === note._id ? (
                          <div className="flex items-center space-x-2 mb-1">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              onBlur={handleSaveTitle}
                              className="flex-1 px-2 py-1 text-sm font-medium bg-white dark:bg-gray-700 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveTitle();
                              }}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h4
                            className={`text-sm font-medium truncate transition-colors
                            ${
                              selectedNoteId === note._id
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }`}
                          >
                            {note.heading || note.title || "Untitled"}
                          </h4>
                        )}

                        {/* Content Preview */}
                        {note.content && !editingNoteId && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {truncateText(note.content)}
                          </p>
                        )}

                        {/* Date */}
                        {!editingNoteId && (
                          <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(note.updatedAt || note.createdAt)}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {!editingNoteId && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTitle(note);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteNote(note._id, e)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
