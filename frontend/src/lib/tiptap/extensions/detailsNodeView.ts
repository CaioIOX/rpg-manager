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

  // Handle the native toggle event to sync state back to TipTap
  const handleToggle = () => {
    // We only care about toggles that change the state relative to our node attributes
    const isOpen = dom.hasAttribute("open");
    if (node.attrs.open === isOpen) {
      return;
    }

    if (typeof getPos !== "function") {
      return;
    }

    const pos = getPos();
    
    // Verify the node still exists at this position and is of the correct type
    // This prevents "RangeError: Index out of range" during rapid updates or collaboration
    const { state } = editor.view;
    if (pos < 0 || pos + node.nodeSize > state.doc.content.size) {
      return;
    }

    const actualNode = state.doc.nodeAt(pos);
    if (!actualNode || actualNode.type.name !== node.type.name) {
      return;
    }

    // Dispatch a transaction to update the 'open' attribute
    // Using dispatch directly ensures atomic execution and syncs with ProseMirror state
    editor.view.dispatch(
      state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        open: isOpen,
      })
    );
  };

  dom.addEventListener("toggle", handleToggle);

  const contentDOM = dom;

  return {
    dom,
    contentDOM,
    update: (updatedNode: ProseMirrorNode) => {
      if (updatedNode.type.name !== node.type.name) {
        return false;
      }
      
      // Update local node reference so the listener uses the latest attributes
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
      dom.removeEventListener("toggle", handleToggle);
    },
  };
};
