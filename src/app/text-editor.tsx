"use client";

import { JSX, useEffect, useState } from "react";

/* Lexical Design System */
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";

/* Lexical Plugins Local */
import TreeViewPlugin from "@/app/plugins/TreeViewPlugin";
import ToolbarPlugin from "@/app/plugins/ToolbarPlugin";
import AutoLinkPlugin from "@/app/plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "@/app/plugins/CodeHighlightPlugin";

/* Lexical Plugins Remote */
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

/* Lexical Others */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ExampleTheme from "@/app/themes/ExampleTheme";
import { $generateHtmlFromNodes } from "@lexical/html";

/* Lexical Texts */
import { textDailyStandup } from "./text-daily-standup";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  namespace: "daily-standup-editor",
  editorState: textDailyStandup,
  // Handling of errors during update
  onError(error: unknown) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

function DownloadHTMLButton() {
  const [editor] = useLexicalComposerContext();

  const handleDownload = () => {
    editor.update(() => {
      const htmlContent = $generateHtmlFromNodes(editor);

      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "editor-content.html";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return <button onClick={handleDownload}>HTML DOWNLOAD</button>;
}

export function Editor(): JSX.Element | null {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <LinkPlugin />
          <TabIndentationPlugin />
          <AutoLinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {/* <TreeViewPlugin /> */}
        </div>
        <DownloadHTMLButton />
      </div>
    </LexicalComposer>
  );
}
