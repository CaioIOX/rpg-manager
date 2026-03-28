import { NodeViewRendererProps } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

/**
 * Custom NodeView for the Details extension to handle the 'open' state.
 * This ensures that the native toggle event is synced with TipTap's state.
 */
export const DetailsNodeView = (props: NodeViewRendererProps) => {
  const { node, getPos, editor, HTMLAttributes } = props;
  
  // Create the main container
  const dom = document.createElement("details");
  dom.classList.add("tiptap-details");
  
  // Set initial open state from attributes
  if (node.attrs.open) {
    dom.setAttribute("open", "");
  }

  // Handle the native toggle event to sync state back to TipTap
  dom.addEventListener("toggle", (event) => {
    // We only care about user-initiated toggles that change the state
    const isOpen = dom.hasAttribute("open");
    if (node.attrs.open !== isOpen && typeof getPos === "function") {
      editor.commands.command(({ tr }) => {
        tr.setNodeMarkup(getPos(), undefined, {
          ...node.attrs,
          open: isOpen,
        });
        return true;
      });
    }
  });

  // The contentDOM is where TipTap will render the child nodes (summary and content)
  // For <details>, both children should be direct descendants of the <details> tag.
  const contentDOM = dom;

  return {
    dom,
    contentDOM,
    update: (updatedNode: ProseMirrorNode) => {
      if (updatedNode.type.name !== node.type.name) {
        return false;
      }
      
      // Sync DOM with new attribute if changed (e.g., from collaboration)
      const isOpen = updatedNode.attrs.open;
      if (dom.hasAttribute("open") !== isOpen) {
        if (isOpen) {
          dom.setAttribute("open", "");
        } else {
          dom.removeAttribute("open");
        }
      }
      return true;
    },
  };
};
