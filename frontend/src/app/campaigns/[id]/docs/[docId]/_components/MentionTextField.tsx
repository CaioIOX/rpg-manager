"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  KeyboardEvent,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentSummary } from "@/lib/types/Documents";
import MentionDropdown from "./MentionDropdown";

// ─── Stored format: @[Title](id) ─────────────────────────────────────────────

const MENTION_RE = /@\[([^\]]+)\]\(([^)]+)\)/g;
const normalise = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// ─── String ↔ DOM helpers ─────────────────────────────────────────────────────

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function valueToHtml(value: string): string {
  const re = new RegExp(MENTION_RE.source, "g");
  let html = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    if (m.index > last) html += esc(value.slice(last, m.index)).replace(/\n/g, "<br>");
    html += `<span class="tmpl-mention" contenteditable="false" data-id="${escAttr(m[2])}" data-title="${escAttr(m[1])}">@${esc(m[1])}</span>`;
    last = m.index + m[0].length;
  }
  if (last < value.length) html += esc(value.slice(last)).replace(/\n/g, "<br>");
  return html;
}

function domToValue(el: HTMLElement): string {
  let out = "";
  const walk = (node: Node, firstChild: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
    } else if (node instanceof HTMLBRElement) {
      out += "\n";
    } else if (node instanceof HTMLElement) {
      if (node.classList.contains("tmpl-mention")) {
        out += `@[${node.getAttribute("data-title") ?? ""}](${node.getAttribute("data-id") ?? ""})`;
      } else {
        const isBlock = ["DIV", "P"].includes(node.tagName);
        if (isBlock && out.length > 0 && !firstChild) out += "\n";
        Array.from(node.childNodes).forEach((c, i) => walk(c, i === 0 && firstChild));
      }
    }
  };
  Array.from(el.childNodes).forEach((c, i) => walk(c, i === 0));
  return out;
}

// ─── Selection / cursor helpers ────────────────────────────────────────────────

function getMentionQuery(el: HTMLElement): string | null {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (range.startContainer.nodeType !== Node.TEXT_NODE) return null;
  if (!el.contains(range.startContainer)) return null;
  const before = (range.startContainer.textContent ?? "").slice(0, range.startOffset);
  const atIdx = before.lastIndexOf("@");
  if (atIdx === -1) return null;
  const frag = before.slice(atIdx + 1);
  if (/\s/.test(frag)) return null;
  return frag;
}

function insertMentionAtCursor(el: HTMLElement, item: DocumentSummary): string {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return domToValue(el);
  const range = sel.getRangeAt(0);
  const textNode = range.startContainer;
  if (textNode.nodeType !== Node.TEXT_NODE || !el.contains(textNode)) return domToValue(el);

  const text = textNode.textContent ?? "";
  const cursor = range.startOffset;
  const atIdx = text.lastIndexOf("@", cursor - 1);
  if (atIdx === -1) return domToValue(el);

  // Build chip
  const chip = document.createElement("span");
  chip.className = "tmpl-mention";
  chip.contentEditable = "false";
  chip.setAttribute("data-id", item.id);
  chip.setAttribute("data-title", item.title);
  chip.textContent = "@" + item.title;

  // Split text node: before-@ | chip | rest
  const afterNode = document.createTextNode(text.slice(cursor));
  const parent = textNode.parentNode!;
  textNode.textContent = text.slice(0, atIdx);
  parent.insertBefore(afterNode, textNode.nextSibling);
  parent.insertBefore(chip, afterNode);

  // Move cursor after chip
  const newRange = document.createRange();
  newRange.setStart(afterNode, 0);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  return domToValue(el);
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface MentionTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  campaignId: string;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
}

const MentionTextField = forwardRef<HTMLDivElement, MentionTextFieldProps>(
  function MentionTextField(
    { label, value, onChange, campaignId, multiline = false, rows, fullWidth = true },
    _ref,
  ) {
    const queryClient = useQueryClient();
    const containerRef = useRef<HTMLDivElement>(null);
    const editableRef = useRef<HTMLDivElement>(null);
    const lastSyncedRef = useRef(value);

    const [isFocused, setIsFocused] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [items, setItems] = useState<DocumentSummary[]>([]);

    // Set HTML content on mount
    useEffect(() => {
      if (!editableRef.current) return;
      editableRef.current.innerHTML = valueToHtml(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync from parent when value changes externally (e.g. initial data load)
    useEffect(() => {
      if (value === lastSyncedRef.current) return;
      if (!editableRef.current) return;
      const current = domToValue(editableRef.current);
      if (current !== value) {
        editableRef.current.innerHTML = valueToHtml(value);
      }
      lastSyncedRef.current = value;
    }, [value]);

    const filterDocs = useCallback(
      (q: string): DocumentSummary[] => {
        const all =
          queryClient.getQueryData<DocumentSummary[]>(["documents", campaignId]) ?? [];
        return all
          .filter((d) => normalise(d.title).includes(normalise(q)))
          .slice(0, 6);
      },
      [campaignId, queryClient],
    );

    const handleInput = useCallback(() => {
      if (!editableRef.current) return;
      const newVal = domToValue(editableRef.current);
      lastSyncedRef.current = newVal;
      onChange(newVal);

      const q = getMentionQuery(editableRef.current);
      if (q !== null) {
        setQuery(q);
        setItems(filterDocs(q));
        setSelectedIndex(0);
        setDropdownOpen(true);
      } else {
        setDropdownOpen(false);
      }
    }, [onChange, filterDocs]);

    const insertMention = useCallback(
      (item: DocumentSummary) => {
        if (!editableRef.current) return;
        const newVal = insertMentionAtCursor(editableRef.current, item);
        lastSyncedRef.current = newVal;
        onChange(newVal);
        setDropdownOpen(false);
        editableRef.current.focus();
      },
      [onChange],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // Suppress Enter for single-line fields
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
      }
      if (!dropdownOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        insertMention(items[selectedIndex]);
      } else if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    useEffect(() => {
      if (dropdownOpen) setItems(filterDocs(query));
    }, [query, dropdownOpen, filterDocs]);

    // Close dropdown on outside click
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Click on a mention chip → open the document in a new tab
    useEffect(() => {
      const el = editableRef.current;
      if (!el) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("tmpl-mention")) {
          e.preventDefault();
          e.stopPropagation();
          const docId = target.getAttribute("data-id");
          if (docId) {
            window.open(`/campaigns/${campaignId}/docs/${docId}`, "_blank");
          }
        }
      };
      el.addEventListener("click", handler);
      return () => el.removeEventListener("click", handler);
    }, [campaignId]);

    const filled = value.trim().length > 0;
    const labelFloating = isFocused || filled;
    const minH = multiline ? `${(rows ?? 3) * 24 + 40}px` : "56px";

    return (
      <Box
        ref={containerRef}
        sx={{ position: "relative", width: fullWidth ? "100%" : undefined }}
      >
        {/* Outer border — mimics MUI OutlinedInput */}
        <Box
          sx={{
            position: "relative",
            borderRadius: "14px",
            border: isFocused
              ? "2px solid rgba(186, 104, 200, 0.85)"
              : "1px solid rgba(255,255,255,0.23)",
            bgcolor: "rgba(13, 17, 23, 0.4)",
            minHeight: minH,
            transition: "border-color 0.15s ease",
            cursor: "text",
            "&:hover:not(:focus-within)": {
              borderColor: "rgba(255,255,255,0.87)",
            },
          }}
          onClick={() => editableRef.current?.focus()}
        >
          {/* Floating label */}
          <Box
            component="span"
            sx={{
              position: "absolute",
              top: labelFloating ? "-9px" : "50%",
              left: "10px",
              transform: labelFloating ? "none" : "translateY(-50%)",
              fontSize: labelFloating ? "0.75rem" : "1rem",
              color: isFocused
                ? "rgba(186, 104, 200, 0.9)"
                : filled
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.4)",
              bgcolor: labelFloating ? "rgba(13,17,23,0.95)" : "transparent",
              px: labelFloating ? "4px" : 0,
              lineHeight: 1,
              pointerEvents: "none",
              transition: "all 0.15s ease",
              zIndex: 1,
            }}
          >
            {label}
          </Box>

          {/* Contenteditable field — holds inline text + mention chip spans */}
          <Box
            ref={editableRef}
            component="div"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
              if (containerRef.current?.contains(e.relatedTarget as Node)) return;
              setIsFocused(false);
              setDropdownOpen(false);
            }}
            sx={{
              outline: "none",
              px: "14px",
              pt: labelFloating ? "20px" : "16px",
              pb: "10px",
              minHeight: minH,
              fontSize: "1rem",
              color: "text.primary",
              lineHeight: 1.5,
              wordBreak: "break-word",
              caretColor: "#ce93d8",
              transition: "padding-top 0.15s ease",
              // Mention chip style — applied to spans inserted via DOM
              "& .tmpl-mention": {
                backgroundColor: "rgba(186, 104, 200, 0.2)",
                color: "#ce93d8",
                borderRadius: "4px",
                padding: "0.1em 0.35em",
                fontSize: "0.925em",
                fontWeight: 500,
                userSelect: "none",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
                "&:hover": {
                  backgroundColor: "rgba(186, 104, 200, 0.38)",
                },
              },
            }}
          />
        </Box>

        {/* Mention dropdown */}
        <Popper
          open={dropdownOpen && items.length > 0}
          anchorEl={containerRef.current}
          placement="bottom-start"
          style={{ zIndex: 1500, width: containerRef.current?.offsetWidth }}
          modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        >
          <MentionDropdown
            items={items}
            selectedIndex={selectedIndex}
            onSelect={insertMention}
          />
        </Popper>
      </Box>
    );
  },
);

export default MentionTextField;
