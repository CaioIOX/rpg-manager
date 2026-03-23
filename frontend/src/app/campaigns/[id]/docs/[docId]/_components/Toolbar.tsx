import { useCurrentEditor } from "@tiptap/react";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

export default function ToolbarComponent() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };



  return (
    <Toolbar>
      <ToolbarGroup>
        <button
          onClick={toggleBold}
          className={editor.isActive("bold") ? "active" : ""}
        >
          <FormatBoldIcon />
        </button>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <button
          onClick={toggleItalic}
          className={editor.isActive("italic") ? "active" : ""}
        >
          <FormatItalicIcon />
        </button>
      </ToolbarGroup>
    </Toolbar>
  );
}
