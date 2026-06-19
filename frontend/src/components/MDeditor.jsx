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

// WYSIWYG editing over a Markdown string end-to-end: notes load their Markdown
// in, and edits serialize back to Markdown on save, so the sidebar preview,
// search, existing notes, and backend are all unaffected.
const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder:
      "Start writing.  ( '# ' heading  ·  '- ' list  ·  '> ' quote  ·  ``` code )",
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Link.configure({ openOnClick: false, autolink: true }),
  Markdown.configure({
    html: false,
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
      aria-pressed={active}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${
        active
          ? "bg-accent text-paper"
          : "text-muted hover:bg-accent-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function Editor() {
  const { activeNoteId, notes, justCreatedId, clearJustCreated } = useAppStore();
  const note = notes.find((n) => n._id === activeNoteId);

  // The note whose content currently lives in the editor. Lets us reload only
  // on a real note switch (not on our own save round-trip) and route the
  // debounced autosave to the right note even if the user switches mid-debounce.
  const loadedNoteId = useRef(null);
  const saveTimer = useRef(null);
  const pending = useRef(null); // { id, md }
  const titleTimer = useRef(null);
  const titlePending = useRef(null); // { id, heading }
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState("");
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

  const flushTitle = useCallback(async () => {
    if (titleTimer.current) {
      clearTimeout(titleTimer.current);
      titleTimer.current = null;
    }
    const p = titlePending.current;
    titlePending.current = null;
    if (!p) return;
    await useAppStore.getState().updateNote(p.id, { heading: p.heading });
  }, []);

  const onTitleChange = (e) => {
    const value = e.target.value;
    const id = loadedNoteId.current;
    setTitle(value);
    if (!id) return;
    // Optimistic store update so the sidebar title tracks as you type.
    useAppStore.setState((s) => ({
      notes: s.notes.map((n) => (n._id === id ? { ...n, heading: value } : n)),
    }));
    titlePending.current = { id, heading: value };
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(flushTitle, 400);
  };

  const editor = useEditor({
    extensions,
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose note-prose max-w-none min-h-[52vh] focus:outline-none",
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

  // Load the selected note into the editor only when the selection changes,
  // never on content updates from our own save.
  useEffect(() => {
    if (!editor) return;
    if (loadedNoteId.current === activeNoteId) return;
    flushSave(); // persist the previous note's body before swapping
    flushTitle(); // and its title
    const selected = useAppStore
      .getState()
      .notes.find((n) => n._id === activeNoteId);
    editor.commands.setContent(selected?.content || "", false);
    setTitle(selected?.heading || "");
    loadedNoteId.current = activeNoteId;
    setCounts(countText(editor.getText()));

    // A freshly created note: drop the user straight into naming it.
    if (selected && selected._id === justCreatedId) {
      requestAnimationFrame(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      });
      clearJustCreated();
    }
  }, [editor, activeNoteId, justCreatedId, clearJustCreated, flushSave, flushTitle]);

  // Persist any pending edit if the editor unmounts.
  useEffect(
    () => () => {
      flushSave();
      flushTitle();
    },
    [flushSave, flushTitle]
  );

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

  if (!note) {
    return (
      <div className="grid h-full place-items-center bg-paper px-6 text-center">
        <div>
          <p className="font-display text-[1.7rem] text-ink">
            A blank page is waiting.
          </p>
          <p className="mt-3 text-muted">
            Pick a note from the list, or start a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto max-w-[720px] px-6 pb-20 pt-14">
          {/* Editable title, with the accent tick. */}
          <div className="mb-3.5 flex items-start gap-3.5">
            <span
              className="mt-[9px] h-[30px] w-[3px] flex-none rounded-[2px] bg-accent"
              aria-hidden="true"
            />
            <input
              ref={titleInputRef}
              value={title}
              onChange={onTitleChange}
              placeholder="Untitled"
              spellCheck={false}
              aria-label="Note title"
              className="w-full bg-transparent font-display text-[2rem] font-semibold leading-tight tracking-tight text-ink placeholder:text-faint focus:outline-none"
            />
          </div>

          {/* The writing column sits past a notebook-style margin rule. */}
          <div className="ml-px border-l border-line pl-[26px]">
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 120 }}
                className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1 shadow-lg"
              >
                <MenuButton
                  label="Bold"
                  active={editor.isActive("bold")}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  label="Italic"
                  active={editor.isActive("italic")}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  label="Strikethrough"
                  active={editor.isActive("strike")}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  label="Inline code"
                  active={editor.isActive("code")}
                  onClick={() => editor.chain().focus().toggleCode().run()}
                >
                  <Code className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  label="Link"
                  active={editor.isActive("link")}
                  onClick={setLink}
                >
                  <LinkIcon className="h-4 w-4" />
                </MenuButton>
              </BubbleMenu>
            )}
            <EditorContent
              editor={editor}
              className="cursor-text"
              onClick={() => editor?.chain().focus().run()}
            />
          </div>
        </article>
      </div>

      {/* Status bar, pinned. */}
      <footer className="flex-none border-t border-line bg-surface px-6 py-2.5">
        <div className="mx-auto flex max-w-[720px] items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          <span className="flex items-center gap-2 text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                saveState === "saving" ? "animate-pulse bg-accent" : "bg-faint"
              }`}
            />
            {saveState === "saving" ? "Saving" : "Saved"}
          </span>
          <span>{counts.words} words</span>
          <span>{counts.chars} chars</span>
        </div>
      </footer>
    </div>
  );
}
