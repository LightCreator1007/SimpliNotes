import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function Editor() {
  const [value, setValue] = useState(`# Welcome to Your Markdown Editor

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

> Happy writing! ✨`);

  const [theme, setTheme] = useState("light");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 max-w-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 mt-1 border-b-2 border-slate-200">
            <h1 className="text-2xl font-bold text-black mb-1">SimpliNotes</h1>
            <p className="text-gray-600 text-sm">
              Your simple and elegant Markdown note maker
            </p>
          </div>

          <div className="p-6 bg-white">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
              <MDEditor
                value={value}
                onChange={(val) => setValue(val || "")}
                height={600}
                preview="live"
                hideToolbar={false}
                data-color-mode={theme}
                previewOptions={{
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
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
