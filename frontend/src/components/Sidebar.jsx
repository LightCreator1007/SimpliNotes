import { useState, useEffect } from "react";
import { Plus, Search, X, Loader2 } from "lucide-react";
import { useAppStore } from "../store";

export default function Sidebar({ onAfterSelect }) {
  const {
    notes,
    loading,
    error,
    activeNoteId,
    setActiveNoteId,
    fetchNotes,
    createNote,
    deleteNote,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auto-open the most recent note once notes load so the editor isn't stuck
  // on the empty state when notes actually exist.
  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0]._id);
    }
  }, [activeNoteId, notes, setActiveNoteId]);

  const filteredNotes = searchQuery
    ? notes.filter((noteItem) => {
        const haystack = `${noteItem.heading || ""} ${noteItem.content || ""}`;
        return haystack.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : notes;

  const handleCreateNote = async () => {
    setIsCreatingNote(true);
    try {
      // Backend requires a non-empty heading; the editor focuses it so the
      // user can name the note immediately.
      const created = await createNote({ heading: "Untitled", content: "" });
      if (created) {
        setActiveNoteId(created._id);
        onAfterSelect?.();
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleNoteClick = (selectedNote) => {
    setActiveNoteId(selectedNote._id);
    onAfterSelect?.();
  };

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this note? This can't be undone.")) {
      try {
        await deleteNote(noteId);
        if (activeNoteId === noteId) {
          const remaining = useAppStore.getState().notes;
          setActiveNoteId(remaining[0]?._id ?? null);
        }
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 84) => {
    if (!text) return "";
    const cleanText = text
      .replace(/^#+\s*/gm, "")
      .replace(/[*_`>#-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "…"
      : cleanText;
  };

  return (
    <div className="flex h-full w-72 flex-col bg-surface">
      {/* Title + new note */}
      <div className="px-4 pb-3 pt-5">
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="font-display text-[1.15rem] font-semibold text-ink">
            Notes
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {notes.length}
          </span>
        </div>

        <button
          onClick={handleCreateNote}
          disabled={isCreatingNote}
          className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-ink py-2.5 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50"
        >
          {isCreatingNote ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              New note
            </>
          )}
        </button>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[9px] border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2.5">
        <p className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          {searchQuery ? `Results (${filteredNotes.length})` : "Recent"}
        </p>

        {loading && notes.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading
          </div>
        )}

        {error && (
          <div className="mx-2 rounded-lg border-l-2 border-danger bg-danger/10 px-3 py-2 text-xs text-danger">
            Could not load notes: {error}
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <div className="px-3 py-12 text-center">
            <p className="text-sm text-muted">
              {searchQuery ? "Nothing matches that" : "No notes yet"}
            </p>
            <p className="mt-1 text-xs text-faint">
              {searchQuery
                ? "Try another word"
                : "Make your first note to begin"}
            </p>
          </div>
        )}

        {(!loading || notes.length > 0) && (
          <ul className="space-y-0.5">
            {filteredNotes.map((noteItem) => {
              const isSelected = activeNoteId === noteItem._id;

              return (
                <li key={noteItem._id}>
                  <div
                    onClick={() => handleNoteClick(noteItem)}
                    className={`group relative cursor-pointer rounded-[9px] border-l-2 px-3 py-2.5 transition-colors ${
                      isSelected
                        ? "border-accent bg-accent-soft"
                        : "border-transparent hover:bg-accent-soft/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`truncate text-sm font-medium ${
                            isSelected ? "text-accent" : "text-ink"
                          }`}
                        >
                          {noteItem.heading || "Untitled"}
                        </h4>
                        {noteItem.content && (
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">
                            {truncateText(noteItem.content)}
                          </p>
                        )}
                        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {formatDate(noteItem.updatedAt || noteItem.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNote(noteItem._id, e)}
                        aria-label="Delete note"
                        className={`grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] text-faint transition-all hover:bg-danger/15 hover:text-danger focus-visible:opacity-100 ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none border-t border-line px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          <span>SimpliNotes</span>
          <span>{notes.length} saved</span>
        </div>
      </div>
    </div>
  );
}
