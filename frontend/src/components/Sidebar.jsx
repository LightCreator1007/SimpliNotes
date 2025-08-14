// import { useState, useEffect, useRef } from "react";
// import {
//   FileText,
//   Plus,
//   Search,
//   X,
//   Clock,
//   Edit3,
//   Check,
//   Trash2,
//   MoreVertical,
//   Loader2,
// } from "lucide-react";
// import { useAppStore } from "../store";

// export default function Sidebar({ note, setNote }) {
//   const {
//     notes,
//     loading,
//     error,
//     fetchNotes,
//     createNote,
//     updateNote,
//     deleteNote,
//     activeNote,
//     setActiveNote,
//   } = useAppStore();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");
//   const [isCreatingNote, setIsCreatingNote] = useState(false);

//   const editInputRef = useRef(null);

//   useEffect(() => {
//     fetchNotes();
//   }, [fetchNotes]);

//   useEffect(() => {
//     if (editingNoteId && editInputRef.current) {
//       editInputRef.current.focus();
//       editInputRef.current.select();
//     }
//   }, [editingNoteId]);

//   // Filter notes based on search
//   const filteredNotes = searchQuery
//     ? notes.filter((noteItem) => {
//         const title = noteItem.heading || noteItem.title || "Untitled";
//         const content = noteItem.content || "";
//         return (
//           title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           content.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       })
//     : notes;

//   // Create new note
//   const handleCreateNote = async () => {
//     setIsCreatingNote(true);
//     try {
//       const newNote = {
//         heading: "New Note",
//         content: `# Welcome to Your Markdown Editor

// Start writing your content here! This editor supports:

// ## Features
// - **Live preview** as you type
// - *Rich formatting* options
// - Code blocks with syntax highlighting
// - Tables, lists, and more!

// ### Code Example
// \`\`\`javascript
// const greeting = "Hello, World!";
// console.log(greeting);
// \`\`\`

// ### Task List
// - [x] Set up the editor
// - [ ] Write amazing content
// - [ ] Share with the world

// > Happy writing! ✨`,
//       };

//       const created = await createNote(newNote);
//       if (created) {
//         // Wait for notes to be refreshed
//         await fetchNotes();
//         // Set the newly created note as active
//         setNote(created);
//         // Start editing the title of the new note
//         startEditingTitle(created);
//       }
//     } catch (err) {
//       console.error("Failed to create note:", err);
//     } finally {
//       setIsCreatingNote(false);
//     }
//   };

//   // Handle note click
//   const handleNoteClick = (selectedNote) => {
//     if (editingNoteId === selectedNote._id) return;
//     setActiveNote(selectedNote._id);
//     setNote(selectedNote);
//   };

//   // Start editing title
//   const startEditingTitle = (noteToEdit) => {
//     setEditingNoteId(noteToEdit._id);
//     setEditingTitle(noteToEdit.heading || noteToEdit.title || "Untitled");
//   };

//   // Save edited title
//   const handleSaveTitle = async () => {
//     if (editingNoteId && editingTitle.trim()) {
//       try {
//         const noteToUpdate = notes.find((n) => n._id === editingNoteId);
//         if (noteToUpdate) {
//           const updatedNoteData = {
//             ...noteToUpdate,
//             heading: editingTitle.trim(),
//           };

//           await updateNote(editingNoteId, updatedNoteData);

//           // Update the current note if it's the one being edited
//           if (note && note._id === editingNoteId) {
//             setNote({
//               ...note,
//               heading: editingTitle.trim(),
//             });
//           }

//           // Refresh notes to show updated title
//           await fetchNotes();
//         }
//       } catch (err) {
//         console.error("Failed to update note title:", err);
//       }
//     }
//     setEditingNoteId(null);
//     setEditingTitle("");
//   };

//   // Cancel editing
//   const handleCancelEdit = () => {
//     setEditingNoteId(null);
//     setEditingTitle("");
//   };

//   // Handle key press in edit input
//   const handleEditKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSaveTitle();
//     } else if (e.key === "Escape") {
//       handleCancelEdit();
//     }
//   };

//   // Delete note
//   const handleDeleteNote = async (noteId, e) => {
//     e.stopPropagation();

//     if (window.confirm("Are you sure you want to delete this note?")) {
//       try {
//         await deleteNote(noteId);

//         // Clear selection if deleted note was selected
//         if (note && note._id === noteId) {
//           setNote(null);
//         }

//         // Refresh notes list
//         await fetchNotes();
//       } catch (err) {
//         console.error("Failed to delete note:", err);
//       }
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Just now";
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Today";
//     if (diffDays === 2) return "Yesterday";
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   // Truncate text
//   const truncateText = (text, maxLength = 60) => {
//     if (!text) return "";
//     const cleanText = text.replace(/^#\s*/, "").replace(/\n/g, " ").trim();
//     return cleanText.length > maxLength
//       ? cleanText.substring(0, maxLength) + "..."
//       : cleanText;
//   };

//   return (
//     <div className="h-4/5 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md ml-2 mt-6">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             Notes
//           </h2>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <button
//           className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={handleCreateNote}
//           disabled={isCreatingNote}
//         >
//           {isCreatingNote ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Creating...
//             </>
//           ) : (
//             <>
//               <Plus className="w-4 h-4 mr-2" />
//               New Note
//             </>
//           )}
//         </button>

//         <div className="mt-3 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search notes..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
//           />
//         </div>
//       </div>

//       {/* Notes List */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-3">
//           <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//             {searchQuery
//               ? `Search Results (${filteredNotes.length})`
//               : `Recent Notes (${notes.length})`}
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

//           {!loading && !error && filteredNotes.length === 0 && (
//             <div className="text-center py-8">
//               <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                 {searchQuery ? "No notes found" : "No notes yet"}
//               </p>
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 {searchQuery
//                   ? "Try a different search term"
//                   : "Create your first note to get started"}
//               </p>
//             </div>
//           )}

//           {!loading && !error && filteredNotes.length > 0 && (
//             <ul className="space-y-1">
//               {filteredNotes.map((noteItem) => {
//                 const isSelected = note && note._id === noteItem._id;
//                 const isEditing = editingNoteId === noteItem._id;

//                 return (
//                   <li key={noteItem._id} className="relative">
//                     <div
//                       onClick={() => handleNoteClick(noteItem)}
//                       className={`w-full p-3 rounded-lg transition-colors duration-200 text-left group cursor-pointer
//                         ${
//                           isSelected
//                             ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
//                             : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
//                         }`}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1 min-w-0">
//                           {/* Title - Editable */}
//                           {isEditing ? (
//                             <div className="flex items-center space-x-2 mb-1">
//                               <input
//                                 ref={editInputRef}
//                                 type="text"
//                                 value={editingTitle}
//                                 onChange={(e) =>
//                                   setEditingTitle(e.target.value)
//                                 }
//                                 onKeyDown={handleEditKeyPress}
//                                 onBlur={handleSaveTitle}
//                                 className="flex-1 px-2 py-1 text-sm font-medium bg-white dark:bg-gray-700 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleSaveTitle();
//                                 }}
//                                 className="p-1 text-green-600 hover:text-green-700"
//                               >
//                                 <Check className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleCancelEdit();
//                                 }}
//                                 className="p-1 text-gray-400 hover:text-gray-600"
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           ) : (
//                             <h4
//                               className={`text-sm font-medium truncate transition-colors
//                               ${
//                                 isSelected
//                                   ? "text-blue-700 dark:text-blue-400"
//                                   : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
//                               }`}
//                             >
//                               {noteItem.heading || noteItem.title || "Untitled"}
//                             </h4>
//                           )}

//                           {/* Content Preview */}
//                           {noteItem.content && !isEditing && (
//                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
//                               {truncateText(noteItem.content)}
//                             </p>
//                           )}

//                           {/* Date */}
//                           {!isEditing && (
//                             <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
//                               <Clock className="w-3 h-3 mr-1" />
//                               {formatDate(
//                                 noteItem.updatedAt || noteItem.createdAt
//                               )}
//                             </div>
//                           )}
//                         </div>

//                         {/* Action Buttons */}
//                         {!isEditing && (
//                           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 startEditingTitle(noteItem);
//                               }}
//                               className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
//                             >
//                               <Edit3 className="w-3 h-3" />
//                             </button>
//                             <button
//                               onClick={(e) => handleDeleteNote(noteItem._id, e)}
//                               className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </li>
//                 );
//               })}
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
  Loader2,
} from "lucide-react";
import { useAppStore } from "../store";

export default function Sidebar({ setNote }) {
  const {
    notes,
    loading,
    error,
    activeNote,
    setActiveNote,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const editInputRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (editingNoteId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingNoteId]);

  // Update parent component when activeNote changes
  useEffect(() => {
    if (activeNote) {
      const selectedNote = notes.find((note) => note._id === activeNote);
      if (selectedNote) {
        setNote(selectedNote);
      }
    } else {
      setNote(null);
    }
  }, [activeNote, notes, setNote]);

  // Filter notes based on search
  const filteredNotes = searchQuery
    ? notes.filter((noteItem) => {
        const title = noteItem.heading || noteItem.title || "Untitled";
        const content = noteItem.content || "";
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
        content: `# Welcome to Your Markdown Editor

Start writing your content here! This editor supports:

## Features
- **Live preview** as you type
- *Rich formatting* options
- Code blocks with syntax highlighting
- Tables, lists, and more!

### Code Example
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Task List
- [x] Set up the editor
- [ ] Write amazing content
- [ ] Share with the world

> Happy writing! ✨`,
      };

      const created = await createNote(newNote);
      if (created) {
        await fetchNotes();
        setActiveNote(created._id);
        startEditingTitle(created);
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsCreatingNote(false);
    }
  };

  // Handle note click
  const handleNoteClick = (selectedNote) => {
    if (editingNoteId === selectedNote._id) return;
    setActiveNote(selectedNote._id);
  };

  // Start editing title
  const startEditingTitle = (noteToEdit) => {
    setEditingNoteId(noteToEdit._id);
    setEditingTitle(noteToEdit.heading || "Untitled");
  };

  // Save edited title
  const handleSaveTitle = async () => {
    if (editingNoteId && editingTitle.trim()) {
      try {
        const noteToUpdate = notes.find((n) => n._id === editingNoteId);
        if (noteToUpdate) {
          const updatedNoteData = {
            ...noteToUpdate,
            heading: editingTitle.trim(),
          };

          await updateNote(editingNoteId, updatedNoteData);
          await fetchNotes();
        }
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
        if (activeNote === noteId) {
          setActiveNote(null);
        }

        await fetchNotes();
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
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
              {filteredNotes.map((noteItem) => {
                const isSelected = activeNote === noteItem._id;
                const isEditing = editingNoteId === noteItem._id;

                return (
                  <li key={noteItem._id} className="relative">
                    <div
                      onClick={() => handleNoteClick(noteItem)}
                      className={`w-full p-3 rounded-lg transition-colors duration-200 text-left group cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex items-center space-x-2 mb-1">
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onKeyDown={handleEditKeyPress}
                                onBlur={handleSaveTitle}
                                className="flex-1 px-2 py-1 text-sm font-medium bg-white dark:bg-gray-700 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-3.5"
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
                                isSelected
                                  ? "text-blue-700 dark:text-blue-400"
                                  : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                              }`}
                            >
                              {noteItem.heading}
                            </h4>
                          )}
                          {noteItem.content && !isEditing && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {truncateText(noteItem.content)}
                            </p>
                          )}
                          {!isEditing && (
                            <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(
                                noteItem.updatedAt || noteItem.createdAt
                              )}
                            </div>
                          )}
                        </div>
                        {!isEditing && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTitle(noteItem);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteNote(noteItem._id, e)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
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
