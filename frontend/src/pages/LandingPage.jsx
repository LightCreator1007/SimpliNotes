import { useState, useEffect } from "react";
import {
  FileText,
  Zap,
  Moon,
  Sun,
  Check,
  ArrowRight,
  Sparkles,
  Cloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function useTypewriter(text, speed = 300) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return { displayText, isComplete };
}

function Header({ isLoggedIn = false, isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              SimpliNotes
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {isLoggedIn ? (
              <button
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/home")}
              >
                Dashboard
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/signup")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const navigate = useNavigate();

  const { displayText, isComplete } = useTypewriter(
    "Where thoughts become clarity.",
    100
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header
        isLoggedIn={false}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 h-20">
              <span className="block text-gray-900 dark:text-white w-3xl ml-auto mr-auto">
                {displayText}
                <span
                  className={`inline-block w-1 h-12 md:h-16 bg-gray-900 dark:bg-white ml-1 ${
                    isComplete ? "animate-pulse" : "animate-blink"
                  }`}
                ></span>
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto mt-26">
              A minimalist note-taking app that strips away the clutter. Just
              you, your thoughts, and perfect simplicity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
                onClick={() => navigate("/signup")}
              >
                Start Writing Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Free forever plan
              </span>
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Export anytime
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features wrapped in simplicity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant load times and real-time sync. Your thoughts move at the
                speed of light.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Cloud className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Available Everywhere
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your notes from any device. Seamless sync across all
                platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your notes?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands who've already made the switch to clarity.
          </p>
          <button
            className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 inline-flex items-center"
            onClick={() => navigate("/signup")}
          >
            Create Your First Note
            <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <span className="font-bold text-xl">SimpliNotes</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
            © 2025 SimpliNotes. Crafted with care for focused minds.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}
