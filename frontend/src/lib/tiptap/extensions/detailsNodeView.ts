import { NodeViewRendererProps } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

/**
 * Custom NodeView for the Details extension to handle the 'open' state.
 * This ensures that the native toggle event is synced with TipTap's state.
 */
export const DetailsNodeView = (props: NodeViewRendererProps) => {
  let { node, getPos, editor } = props;
  
  const dom = document.createElement("details");
  dom.classList.add("tiptap-details");
  
  if (node.attrs.open) {
    dom.setAttribute("open", "");
  }

  // Handle the click on summary manually to ensure the attribute is synced correctly.
  // We use preventDefault() to stop the native toggle and handle it ourselves,
  // which is more reliable in a controlled contenteditable environment.
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const summary = target.closest("summary");
    
    if (summary && dom.contains(summary)) {
      // Only toggle if clicking the summary itself or its children
      // We don't want to prevent default if clicking something interactive like a link
      if (target.tagName === "A") return;

      e.preventDefault();
      e.stopPropagation();

      const willBeOpen = !dom.hasAttribute("open");
      
      // Update DOM immediately for instant feedback
      if (willBeOpen) {
        dom.setAttribute("open", "");
      } else {
        dom.removeAttribute("open");
      }

      // Sync with editor state
      if (typeof getPos !== "function") return;
      const pos = getPos();
      
      const { state } = editor.view;
      if (pos < 0 || pos + node.nodeSize > state.doc.content.size) return;

      const actualNode = state.doc.nodeAt(pos);
      if (!actualNode || actualNode.type.name !== node.type.name) return;

      editor.view.dispatch(
        state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          open: willBeOpen,
        })
      );
    }
  };

  dom.addEventListener("click", handleClick);

  const contentDOM = dom;

  return {
    dom,
    contentDOM,
    update: (updatedNode: ProseMirrorNode) => {
      if (updatedNode.type.name !== node.type.name) {
        return false;
      }
      
      node = updatedNode;
      
      const isOpen = node.attrs.open;
      if (dom.hasAttribute("open") !== isOpen) {
        if (isOpen) {
          dom.setAttribute("open", "");
        } else {
          dom.removeAttribute("open");
        }
      }
      return true;
    },
    destroy: () => {
      dom.removeEventListener("click", handleClick);
    },
  };
};
