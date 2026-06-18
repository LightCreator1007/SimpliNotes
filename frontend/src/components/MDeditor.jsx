import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from "lucide-react";
import { useAppStore } from "../store.js";

// Notion-style WYSIWYG editing. Content stays a Markdown string end-to-end:
// notes load their Markdown in, and edits serialize back to Markdown on save,
// so the sidebar preview/search, existing notes, and backend are unaffected.
const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Start writing… ( '# ' heading · '- ' list · '> ' quote · ``` code )",
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Link.configure({ openOnClick: false, autolink: true }),
  Markdown.configure({
    html: false, // ignore raw HTML in markdown (parity with the old sanitizer)
    bulletListMarker: "-",
    linkify: true,
    breaks: false,
    transformPastedText: true,
  }),
];

function countText(text) {
  return {
    chars: text.length,
    words: text.split(/\s+/).filter(Boolean).length,
  };
}

function MenuButton({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function Editor({ isDarkMode }) {
  const { activeNoteId, notes } = useAppStore();
  const note = notes.find((n) => n._id === activeNoteId);

  // The note whose content currently lives in the editor. Lets us reload only
  // on a real note switch (not on our own save round-trip) and route the
  // debounced autosave to the right note even if the user switches mid-debounce.
  const loadedNoteId = useRef(null);
  const saveTimer = useRef(null);
  const pending = useRef(null); // { id, md }
  const [counts, setCounts] = useState({ chars: 0, words: 0 });
  const [saveState, setSaveState] = useState("saved"); // "saved" | "saving"

  const flushSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const p = pending.current;
    pending.current = null;
    if (!p) return;
    const store = useAppStore.getState();
    const current = store.notes.find((n) => n._id === p.id);
    if ((current?.content || "") === p.md) return;
    setSaveState("saving");
    await store.updateNote(p.id, { content: p.md });
    setSaveState("saved");
  }, []);

  const editor = useEditor({
    extensions,
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[520px] focus:outline-none px-2 py-1",
      },
    },
    onUpdate: ({ editor }) => {
      setCounts(countText(editor.getText()));
      const id = loadedNoteId.current;
      if (!id) return;
      // Capture id + markdown now so a fast note-switch can't misroute the save.
      pending.current = { id, md: editor.storage.markdown.getMarkdown() };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flushSave, 400);
    },
  });

  // Load the selected note's Markdown into the editor only when the selection
  // changes — never on content updates from our own save.
  useEffect(() => {
    if (!editor) return;
    if (loadedNoteId.current === activeNoteId) return;
    flushSave(); // persist the previous note before swapping content in
    const selected = useAppStore.getState().notes.find((n) => n._id === activeNoteId);
    editor.commands.setContent(selected?.content || "", false);
    loadedNoteId.current = activeNoteId;
    setCounts(countText(editor.getText()));
  }, [editor, activeNoteId, flushSave]);

  // Persist any pending edit if the editor unmounts.
  useEffect(() => () => flushSave(), [flushSave]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div
      className="min-h-screen p-6 max-w-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white"
      data-color-mode={isDarkMode ? "dark" : "light"}
    >
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl shadow-2xl border overflow-hidden bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
          <div
            className={`p-6 mt-1 border-b-2 ${
              isDarkMode ? "border-gray-700" : "border-slate-200"
            }`}
          >
            <h1 className="text-2xl font-bold mb-1">SimpliNotes</h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Your simple and elegant Markdown note maker
            </p>
          </div>

          <div className={isDarkMode ? "p-6 bg-gray-900" : "p-6 bg-white"}>
            {note ? (
              <div
                className={`rounded-xl overflow-hidden border ${
                  isDarkMode ? "border-gray-700" : "border-slate-200"
                }`}
              >
                {editor && (
                  <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <MenuButton
                      label="Bold"
                      active={editor.isActive("bold")}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      <Bold className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      label="Italic"
                      active={editor.isActive("italic")}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                      <Italic className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      label="Strikethrough"
                      active={editor.isActive("strike")}
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                      <Strikethrough className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      label="Inline code"
                      active={editor.isActive("code")}
                      onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                      <Code className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                      label="Link"
                      active={editor.isActive("link")}
                      onClick={setLink}
                    >
                      <LinkIcon className="w-4 h-4" />
                    </MenuButton>
                  </BubbleMenu>
                )}
                <EditorContent
                  editor={editor}
                  className="bg-white dark:bg-gray-800 px-4 py-3 min-h-[520px] cursor-text"
                  onClick={() => editor?.chain().focus().run()}
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

          <div className="px-6 py-4 border-t dark:bg-gray-800 dark:border-gray-700 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      saveState === "saving"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  ></span>
                  {saveState === "saving" ? "Saving…" : "Saved"}
                </span>
                <span>Characters: {counts.chars}</span>
                <span>Words: {counts.words}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
