import { NodeTypes } from "@xyflow/react";
import StickyNoteNode from "./StickyNoteNode";
import TextNode from "./TextNode";
import DocumentCardNode from "./DocumentCardNode";
import ShapeNode from "./ShapeNode";

export const nodeTypes: NodeTypes = {
  stickyNote: StickyNoteNode,
  text: TextNode,
  documentCard: DocumentCardNode,
  shape: ShapeNode,
};
