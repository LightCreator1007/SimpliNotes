import { useNavigate } from "react-router-dom";

// Wordmark. The accent on "Notes" carries the brand. The blinking caret lives
// only on the landing hero headline; the optional `caret` prop stays available
// but is intentionally unused here.
const SIZES = {
  sm: { text: "text-lg", caret: "h-[0.9rem]" },
  md: { text: "text-[1.35rem]", caret: "h-[1.05rem]" },
  lg: { text: "text-2xl", caret: "h-[1.2rem]" },
};

export default function Wordmark({ to, size = "md", caret = false, className = "" }) {
  const navigate = useNavigate();
  const { text, caret: caretH } = SIZES[size] || SIZES.md;

  const mark = (
    <>
      <span
        className={`font-display ${text} font-semibold tracking-tight text-ink`}
      >
        Simpli<span className="text-accent">Notes</span>
      </span>
      {caret && (
        <span className={`caret ml-0.5 ${caretH}`} aria-hidden="true" />
      )}
    </>
  );

  if (to !== undefined) {
    return (
      <button
        type="button"
        onClick={() => navigate(to)}
        aria-label="SimpliNotes home"
        className={`inline-flex items-baseline rounded-sm ${className}`}
      >
        {mark}
      </button>
    );
  }

  return <span className={`inline-flex items-baseline ${className}`}>{mark}</span>;
}
