import { useEffect, useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useAppStore } from "../store.js";

export default function Editor({ isDarkMode }) {
  const { updateNote, activeNoteId, notes } = useAppStore();
  const note = notes.find((n) => n._id === activeNoteId);
  const [value, setValue] = useState(note?.content || "");
  const justSwitched = useRef(false);

  useEffect(() => {
    setValue(note?.content || "");
    justSwitched.current = true;
  }, [note?.content]);

  useEffect(() => {
    if (!note || !note?._id) return;

    if (justSwitched.current) {
      justSwitched.current = false;
      return;
    }

    const t = setTimeout(() => {
      if (note.content !== value) {
        updateNote(note?._id, { content: value });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [note, value, updateNote]);

  return (
    <div
      className="min-h-screen p-6 max-w-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white"
      data-color-mode={isDarkMode ? "dark" : "light"}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`rounded-2xl shadow-2xl border overflow-hidden bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div
            className={`p-6 mt-1 border-b-2 
            ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}
          >
            <h1 className="text-2xl font-bold mb-1">SimpliNotes</h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Your simple and elegant Markdown note maker
            </p>
          </div>

          <div className={isDarkMode ? "p-6 bg-gray-900" : "p-6 bg-white"}>
            {note ? (
              <div
                className={`rounded-xl overflow-hidden border
                ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}
              >
                <MDEditor
                  value={value}
                  onChange={(val) => setValue(val || "")}
                  height={600}
                  preview="live"
                  hideToolbar={false}
                  data-color-mode={isDarkMode ? "dark" : "light"}
                  previewOptions={{
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No notes found. 📝</p>
                <p className="mt-2">
                  Select or create a note to start writing.
                </p>
              </div>
            )}
          </div>

          <div
            className={`px-6 py-4 border-t
                dark:bg-gray-800 dark:border-gray-700
                bg-slate-50 border-slate-200
            `}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Live Preview Active
                </span>
                <span>Characters: {value.length}</span>
                <span>
                  Words:{" "}
                  {value.split(/\s+/).filter((word) => word.length > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
