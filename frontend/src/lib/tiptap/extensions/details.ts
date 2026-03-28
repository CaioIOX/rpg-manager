import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { DetailsNodeView } from "./detailsNodeView";

/**
 * Details extension — Custom implementation using native HTML <details>/<summary>.
 * Free alternative to the TipTap Pro details extension.
 */

export const DetailsSummary = Node.create({
  name: "detailsSummary",
  content: "inline*",
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: "summary" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["summary", mergeAttributes(HTMLAttributes, { class: "details-summary" }), 0];
  },
});

export const DetailsContent = Node.create({
  name: "detailsContent",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "div[data-type='details-content']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "details-content",
        "data-type": "details-content",
      }),
      0,
    ];
  },
});

export const Details = Node.create({
  name: "details",
  group: "block",
  content: "detailsSummary detailsContent",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (element) => element.hasAttribute("open"),
        renderHTML: (attributes) => (attributes.open ? { open: "" } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "details" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(HTMLAttributes, { class: "tiptap-details" }),
      0,
    ];
  },

  addNodeView() {
    return DetailsNodeView;
  },

  addCommands() {
    return {
      setDetails:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { open: true },
            content: [
              {
                type: "detailsSummary",
                content: [{ type: "text", text: "Título do bloco" }],
              },
              {
                type: "detailsContent",
                content: [{ type: "paragraph" }],
              },
            ],
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const parentType = $from.node(-1)?.type.name;

        // If cursor is in the summary, Tab moves to the content
        if (parentType === "detailsSummary") {
          return editor.commands.command(({ tr, dispatch }) => {
            const detailsNode = $from.node(-2);
            if (detailsNode?.type.name !== "details") return false;
            const detailsStart = $from.before(-2);
            const summaryNode = detailsNode.child(0);
            // content starts after <details> open + <summary> node
            const contentPos = detailsStart + 1 + summaryNode.nodeSize + 1;
            if (dispatch) tr.setSelection(TextSelection.near(tr.doc.resolve(contentPos)));
            return true;
          });
        }
        return false;
      },
    };
  },
});

// Extend the Commands interface for TypeScript
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    details: {
      setDetails: () => ReturnType;
    };
  }
}
