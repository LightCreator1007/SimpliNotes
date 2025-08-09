import Header from "../components/Header.jsx";
import Editor from "../components/MDeditor.jsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen gap-3 bg-gray-50 scroll-smooth">
      <Header />
      <main className="flex felx-col min-h-screen">
        <div className="w-full mas-w-4xl">
          <Editor />
        </div>
      </main>
    </div>
  );
}
