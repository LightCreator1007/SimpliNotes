import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../utils/useDarkMode.js";
import Wordmark from "../components/Wordmark.jsx";

function ThemeToggle({ isDark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/* A faithful preview of the editor itself: the page is the hero. */
function PagePreview() {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(28,27,23,0.4)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-sm text-muted">Reading list</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          Saved
        </span>
      </div>
      <div className="px-5 py-6">
        <div className="border-l-2 border-accent pl-5">
          <h3 className="font-display text-xl font-semibold text-ink">
            Books for the winter
          </h3>
          <p className="mt-2 font-display text-[0.95rem] leading-relaxed text-muted">
            A few to get to before the year turns over.
          </p>
          <ul className="mt-4 space-y-2 font-display text-[0.95rem] text-ink">
            <li className="flex items-start gap-3">
              <span className="mt-1 grid h-4 w-4 place-items-center rounded-[3px] border border-accent bg-accent text-[10px] font-bold text-paper">
                ✓
              </span>
              <span className="text-muted line-through">
                A Pattern Language
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-4 w-4 rounded-[3px] border border-faint" />
              <span>The Elements of Typographic Style</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-4 w-4 rounded-[3px] border border-faint" />
              <span>The Name of the Rose</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        <span>34 words</span>
        <span>3 lines</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isDark, toggle] = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Wordmark to="/" />
          <div className="flex items-center gap-1 sm:gap-3">
            <a
              href="#what"
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink min-[760px]:block"
            >
              What it is
            </a>
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <button
              onClick={() => navigate("/login")}
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink min-[760px]:block"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md"
            >
              Start writing
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 min-[900px]:grid-cols-[1.05fr_0.95fr]">
          <div className="rise">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              A markdown notebook
            </p>
            <h1 className="mt-6 font-display text-[2.7rem] font-medium leading-[1.04] tracking-tight text-ink min-[900px]:text-[3.6rem]">
              Write first.
              <br />
              <span className="italic text-muted">The rest can wait</span>
              <span
                className="caret ml-3 relative top-[2px] h-[0.8em]"
                aria-hidden="true"
              />
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              SimpliNotes keeps one clean page in front of you. Markdown when
              you want it, plain words when you don't, and every keystroke saved
              on its own.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                onClick={() => navigate("/signup")}
                className="rounded-full bg-ink px-7 py-3.5 text-base font-medium text-paper transition-all hover:-translate-y-px hover:shadow-lg"
              >
                Open a blank page
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-base text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                I already have an account
              </button>
            </div>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
              Free to use
              <span className="mx-3 text-line">/</span>
              Works in light and dark
            </p>
          </div>

          <div className="rise [animation-delay:120ms]">
            <PagePreview />
          </div>
        </div>
      </section>

      {/* What it is */}
      <section id="what" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-faint">
              What it is
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              A notebook with nothing to learn.
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line min-[900px]:grid-cols-3">
            {[
              {
                title: "Plain markdown",
                body: "Headings, lists, quotes, code, and checklists. Type the shortcut and the formatting follows. No menus to hunt through.",
              },
              {
                title: "Saves itself",
                body: "Every keystroke is written the moment you make it. There is no save button here, because you never need to find one.",
              },
              {
                title: "Light and dark",
                body: "Warm paper by day, quiet ink at night. Your eyes choose the room, and the writing stays exactly the same.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-surface p-8">
                <div className="mb-5 h-6 w-px bg-accent" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
            The page is already open.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            Make an account, and your first note is one click away.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-9 rounded-full bg-ink px-8 py-4 text-base font-medium text-paper transition-all hover:-translate-y-px hover:shadow-lg"
          >
            Create your first note
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <Wordmark />
          <div className="flex items-center gap-7 text-sm text-muted">
            <a href="#what" className="transition-colors hover:text-ink">
              What it is
            </a>
            <button
              onClick={() => navigate("/login")}
              className="transition-colors hover:text-ink"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="transition-colors hover:text-ink"
            >
              Sign up
            </button>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            © 2026 SimpliNotes
          </p>
        </div>
      </footer>
    </div>
  );
}
