// RichTextEditor.tsx
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline as UnderlineIcon,
} from "lucide-react";

import { cn } from "components/ui/cn";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const ExitHeadingOnEnter = Extension.create({
  name: "exitHeadingOnEnter",
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor;
        const { $from, empty } = state.selection;
        const isAtEndOfHeading =
          empty &&
          $from.parent.type.name === "heading" &&
          $from.parentOffset === $from.parent.content.size;

        if (!isAtEndOfHeading) return false;

        return this.editor
          .chain()
          .insertContentAt($from.pos, { type: "paragraph" })
          .run();
      },
    };
  },
});

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  // Tracks the last value we pushed *out* via onChange, so the sync effect
  // never fights its own update or a mid-click blur.
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExtension,
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing...",
      }),
      ExitHeadingOnEnter,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror min-h-[12rem] px-3.5 py-2.5 text-sm text-ink-900 outline-none dark:text-ink-50",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
  });

  // One-way sync: only push external `value` changes into the editor when
  // they didn't originate from the editor itself. This avoids the classic
  // "click a toolbar button, content snaps back" bug.
  useEffect(() => {
    if (!editor) return;

    const incoming = value || "<p></p>";
    if (incoming === lastEmittedRef.current) return;
    if (incoming === editor.getHTML()) {
      lastEmittedRef.current = incoming;
      return;
    }

    lastEmittedRef.current = incoming;
    editor.commands.setContent(incoming, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:border-ink-700 dark:bg-ink-900">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// ---------- Toolbar ----------

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

function Toolbar({ editor }: { editor: EditorInstance | null }) {
  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  return (
    <div className="flex flex-wrap gap-1 border-b px-2 py-2 dark:border-ink-700 dark:bg-ink-950">
      <ToolbarButton
        label="Paragraph"
        active={isActive("paragraph")}
        disabled={!editor.can().setParagraph()}
        onToggle={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 1"
        active={isActive("heading", { level: 1 })}
        disabled={!editor.can().toggleHeading({ level: 1 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={isActive("heading", { level: 2 })}
        disabled={!editor.can().toggleHeading({ level: 2 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={isActive("heading", { level: 3 })}
        disabled={!editor.can().toggleHeading({ level: 3 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Bold"
        active={isActive("bold")}
        disabled={!editor.can().toggleBold()}
        onToggle={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={isActive("italic")}
        disabled={!editor.can().toggleItalic()}
        onToggle={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={isActive("underline")}
        disabled={!editor.can().toggleUnderline()}
        onToggle={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Block quote"
        active={isActive("blockquote")}
        disabled={!editor.can().toggleBlockquote()}
        onToggle={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Bulleted list"
        active={isActive("bulletList")}
        disabled={!editor.can().toggleBulletList()}
        onToggle={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={isActive("orderedList")}
        disabled={!editor.can().toggleOrderedList()}
        onToggle={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

function Divider() {
  return (
    <span
      className="mx-1 w-px self-stretch bg-ink-200 dark:bg-ink-700"
      aria-hidden="true"
    />
  );
}

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
  children: ReactNode;
};

function ToolbarButton({
  active,
  disabled,
  label,
  onToggle,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      // onMouseDown + preventDefault stops the editor from blurring
      // before the command runs, which is what toggles selection-based
      // marks/nodes correctly.
      onMouseDown={(event) => {
        event.preventDefault();
        if (disabled) return;
        onToggle();
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border text-ink-600 transition",
        "hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        active
          ? "border-ink-900 bg-ink-200 text-ink-900 dark:border-clay-500 dark:bg-clay-500 dark:text-ink-950"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
