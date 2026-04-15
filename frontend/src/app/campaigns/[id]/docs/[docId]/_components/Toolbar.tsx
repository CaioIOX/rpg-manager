"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { WebsocketProvider } from "y-websocket";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import CollaborationAvatars from "./CollaborationAvatars";
import { useLocale } from "@/lib/i18n";

interface ConnectedUser {
  name: string;
  color: string;
  clientId: number;
}

interface EditorToolbarProps {
  editor: Editor;
  connectedUsers: ConnectedUser[];
  providerRef: React.MutableRefObject<WebsocketProvider | null>;
}

interface ToolbarActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
  children: React.ReactNode;
  disabled?: boolean;
}

// TEXT_COLORS is now handled inside the component to support translations

function ToolbarActionButton({
  onClick,
  isActive,
  tooltip,
  children,
  disabled,
}: ToolbarActionButtonProps) {
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <IconButton
          onClick={onClick}
          size="small"
          disabled={disabled}
          sx={{
            color: isActive ? "#D4AF37" : "text.secondary",
            bgcolor: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent",
            borderRadius: "8px",
            p: 0.8,
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: isActive
                ? "rgba(212, 175, 55, 0.15)"
                : "rgba(255, 255, 255, 0.06)",
              color: isActive ? "#E8CC6E" : "text.primary",
            },
            "&.Mui-disabled": {
              color: "rgba(139, 148, 158, 0.3)",
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        mx: 0.5,
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    />
  );
}

// Insert table dialog
function InsertTableButton({ editor }: { editor: Editor }) {
  const { t } = useLocale();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");

  const handleInsert = () => {
    const r = Math.max(1, Math.min(20, parseInt(rows) || 3));
    const c = Math.max(1, Math.min(10, parseInt(cols) || 3));
    editor
      .chain()
      .focus()
      .insertTable({ rows: r, cols: c, withHeaderRow: true })
      .run();
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t.editor.toolbar.insertTable} arrow>
        <span ref={anchorRef}>
          <IconButton
            onClick={() => setOpen(true)}
            size="small"
            sx={{
              color: editor.isActive("table") ? "#D4AF37" : "text.secondary",
              bgcolor: editor.isActive("table")
                ? "rgba(212, 175, 55, 0.1)"
                : "transparent",
              borderRadius: "8px",
              p: 0.8,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.06)",
                color: "text.primary",
              },
            }}
          >
            <TableChartOutlinedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </span>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "rgba(22, 27, 34, 0.98)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
              borderRadius: "14px",
              p: 2,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
              minWidth: 200,
            },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 1.5,
            display: "block",
          }}
        >
          {t.editor.toolbar.newTable}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <TextField
            label={t.editor.toolbar.rows}
            type="number"
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            size="small"
            inputProps={{ min: 1, max: 20 }}
            sx={{
              width: 80,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
              "& .MuiInputLabel-root": { fontSize: "0.8rem" },
            }}
          />
          <TextField
            label={t.editor.toolbar.cols}
            type="number"
            value={cols}
            onChange={(e) => setCols(e.target.value)}
            size="small"
            inputProps={{ min: 1, max: 10 }}
            sx={{
              width: 80,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
              "& .MuiInputLabel-root": { fontSize: "0.8rem" },
            }}
          />
        </Box>
        <Box
          onClick={handleInsert}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            py: 0.9,
            px: 1.5,
            borderRadius: "10px",
            bgcolor: "rgba(212, 175, 55, 0.12)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "#D4AF37",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "rgba(212, 175, 55, 0.2)",
            },
          }}
        >
          <AddIcon sx={{ fontSize: "0.9rem" }} />
          {t.editor.toolbar.insertTable}
        </Box>
      </Popover>
    </>
  );
}

// Table editing actions (row/col add/delete)
function TableActionsMenu({ editor }: { editor: Editor }) {
  const { t } = useLocale();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!editor.isActive("table")) return null;

  const actions = [
    {
      label: t.editor.toolbar.addRowAfter,
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: t.editor.toolbar.addRowBefore,
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: t.editor.toolbar.addColumnAfter,
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: t.editor.toolbar.addColumnBefore,
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    { label: "divider", action: () => {} },
    {
      label: t.editor.toolbar.deleteRow,
      action: () => editor.chain().focus().deleteRow().run(),
      danger: true,
    },
    {
      label: t.editor.toolbar.deleteColumn,
      action: () => editor.chain().focus().deleteColumn().run(),
      danger: true,
    },
    {
      label: t.editor.toolbar.deleteTable,
      action: () => editor.chain().focus().deleteTable().run(),
      danger: true,
    },
  ];

  return (
    <>
      <Tooltip title={t.editor.toolbar.editTable} arrow>
        <span>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{
              color: "#D4AF37",
              bgcolor: "rgba(212, 175, 55, 0.08)",
              borderRadius: "8px",
              p: 0.8,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "rgba(212, 175, 55, 0.15)",
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "rgba(22, 27, 34, 0.98)",
              border: "1px solid rgba(212, 175, 55, 0.12)",
              borderRadius: "12px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
              minWidth: 200,
            },
          },
        }}
      >
        {actions.map((action, i) =>
          action.label === "divider" ? (
            <Divider
              key={i}
              sx={{ borderColor: "rgba(255,255,255,0.06)", my: 0.5 }}
            />
          ) : (
            <MenuItem
              key={action.label}
              onClick={() => {
                action.action();
                setAnchorEl(null);
              }}
              sx={{
                fontSize: "0.8rem",
                color: action.danger ? "#F85149" : "text.secondary",
                borderRadius: "8px",
                mx: 0.5,
                "&:hover": {
                  bgcolor: action.danger
                    ? "rgba(248, 81, 73, 0.1)"
                    : "rgba(255,255,255,0.06)",
                  color: action.danger ? "#FF6B6B" : "text.primary",
                },
              }}
            >
              {action.label}
            </MenuItem>
          ),
        )}
      </Menu>
    </>
  );
}

export default function EditorToolbar({
  editor,
  connectedUsers,
  providerRef,
}: EditorToolbarProps) {
  const { t } = useLocale();
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  const TEXT_COLORS = [
    { label: t.editor.colors.default, value: "" },
    { label: t.editor.colors.gold, value: "#D4AF37" },
    { label: t.editor.colors.lightGold, value: "#E8CC6E" },
    { label: t.editor.colors.purple, value: "#BA68C8" },
    { label: t.editor.colors.red, value: "#F85149" },
    { label: t.editor.colors.green, value: "#3FB950" },
    { label: t.editor.colors.blue, value: "#58A6FF" },
    { label: t.editor.colors.orange, value: "#F0883E" },
    { label: t.editor.colors.gray, value: "#8B949E" },
    { label: t.editor.colors.white, value: "#FFFFFF" },
  ];

  // Subscribe to editor state so toolbar re-renders on every selection/transaction change.
  // This ensures isActive() reflects the correct state when cursor moves or text is selected.
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isTaskList: ctx.editor.isActive("taskList"),
      isTable: ctx.editor.isActive("table"),
      isDetails: ctx.editor.isActive("details"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      textColor: ctx.editor.getAttributes("textStyle").color,
    }),
  });

  const applyColor = (color: string) => {
    if (color === "") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setColorAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 0.3,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: 1,
        borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
        bgcolor: "rgba(13, 17, 23, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "inherit",
        backdropFilter: "blur(12px)",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {/* Left: all editor action buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, flexWrap: "wrap" }}>
        {([1, 2, 3] as const).map((level) => (
          <ToolbarActionButton
            key={level}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level })
                .run()
            }
            isActive={level === 1 ? editorState.isH1 : level === 2 ? editorState.isH2 : editorState.isH3}
            tooltip={level === 1 ? t.editor.toolbar.h1 : level === 2 ? t.editor.toolbar.h2 : t.editor.toolbar.h3}
          >
            <Box
              component="span"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 800,
                fontFamily: '"Merriweather", serif',
                lineHeight: 1,
                minWidth: "18px",
                textAlign: "center",
              }}
            >
              H{level}
            </Box>
          </ToolbarActionButton>
        ))}

        <ToolbarDivider />

        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState.isBold}
          tooltip={t.editor.toolbar.bold}
        >
          <FormatBoldIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState.isItalic}
          tooltip={t.editor.toolbar.italic}
        >
          <FormatItalicIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editorState.isUnderline}
          tooltip={t.editor.toolbar.underline}
        >
          <FormatUnderlinedIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editorState.isStrike}
          tooltip={t.editor.toolbar.strikethrough}
        >
          <StrikethroughSIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>

        <ToolbarDivider />

        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState.isBulletList}
          tooltip={t.editor.toolbar.bulletList}
        >
          <FormatListBulletedIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState.isOrderedList}
          tooltip={t.editor.toolbar.orderedList}
        >
          <FormatListNumberedIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editorState.isTaskList}
          tooltip={t.editor.toolbar.taskList}
        >
          <CheckBoxOutlinedIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>

        <ToolbarDivider />

        <InsertTableButton editor={editor} />
        <TableActionsMenu editor={editor} />

        <ToolbarDivider />

        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isBlockquote}
          tooltip={t.editor.toolbar.blockquote}
        >
          <FormatQuoteIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editorState.isCodeBlock}
          tooltip={t.editor.toolbar.codeBlock}
        >
          <CodeIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().setDetails().run()}
          isActive={editorState.isDetails}
          tooltip={t.editor.toolbar.details}
        >
          <UnfoldLessIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
        <ToolbarActionButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip={t.editor.toolbar.horizontalRule}
        >
          <HorizontalRuleIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>

        <ToolbarDivider />

        <Tooltip title={t.editor.toolbar.textColor} arrow>
          <IconButton
            onClick={(event) => setColorAnchor(event.currentTarget)}
            size="small"
            sx={{
              color:
                editor.getAttributes("textStyle").color || "text.secondary",
              borderRadius: "8px",
              p: 0.8,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.06)",
                color: "text.primary",
              },
            }}
          >
            <FormatColorTextIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(colorAnchor)}
          anchorEl={colorAnchor}
          onClose={() => setColorAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "background.paper",
                border: "1px solid rgba(212, 175, 55, 0.12)",
                borderRadius: "14px",
                p: 1.5,
                boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 0.8,
            }}
          >
            {TEXT_COLORS.map((color) => (
              <Tooltip key={color.label} title={color.label} arrow>
                <Box
                  onClick={() => applyColor(color.value)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: color.value || "#E6E6E6",
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor:
                      editor.getAttributes("textStyle").color === color.value
                        ? "#D4AF37"
                        : "rgba(255,255,255,0.08)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      transform: "scale(1.15)",
                      borderColor: "rgba(212, 175, 55, 0.4)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Popover>

        <ToolbarActionButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          tooltip={t.editor.toolbar.clearFormatting}
        >
          <FormatClearIcon sx={{ fontSize: "1.1rem" }} />
        </ToolbarActionButton>
      </Box>

      {/* Right: collaboration avatars */}
      <CollaborationAvatars
        connectedUsers={connectedUsers}
        providerRef={providerRef}
      />
    </Box>
  );
}
