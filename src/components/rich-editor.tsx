"use client";

import { useEffect, useRef, useState } from "react";
import { toEditorHtml } from "@/lib/rich-html";

const tools = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Heading", command: "formatBlock", value: "h2" },
  { label: "Paragraph", command: "formatBlock", value: "p" },
  { label: "List", command: "insertUnorderedList" },
  { label: "Numbered", command: "insertOrderedList" },
] as const;

export function RichEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const initial = toEditorHtml(defaultValue || "");
  const editor = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(initial);

  useEffect(() => {
    if (editor.current && editor.current.innerHTML !== initial) editor.current.innerHTML = initial;
  }, [initial]);

  function sync() {
    setHtml(editor.current?.innerHTML || "");
  }

  function run(command: string, value?: string) {
    editor.current?.focus();
    document.execCommand(command, false, value);
    sync();
  }

  function addLink() {
    const url = window.prompt("Link address. Use a site path such as /work, or a full https:// address.");
    if (!url) return;
    const href = url.trim();
    if (!href.startsWith("/") && !href.startsWith("https://")) return;
    run("createLink", href);
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">Article</span>
      <div className="mb-2 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            className="rounded-full border border-line bg-card px-3 py-1 text-xs"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(tool.command, "value" in tool ? tool.value : undefined)}
          >
            {tool.label}
          </button>
        ))}
        <button type="button" className="rounded-full border border-line bg-card px-3 py-1 text-xs" onMouseDown={(event) => event.preventDefault()} onClick={addLink}>
          Link
        </button>
      </div>
      <div
        ref={editor}
        className="rich-editor field min-h-72 text-[17px] leading-8"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Article"
        onInput={sync}
        suppressContentEditableWarning
      />
      <input type="hidden" name={name} value={html} />
      <span className="mt-1.5 block text-xs leading-5 text-muted">Write the article here. Use the buttons for headings, lists, and links.</span>
    </div>
  );
}
