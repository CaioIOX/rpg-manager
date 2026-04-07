package service

import (
	"encoding/json"
	"fmt"
	"strings"
)

// tiptapNode representa um nó genérico do JSON gerado pelo TipTap/ProseMirror.
type tiptapNode struct {
	Type    string            `json:"type"`
	Text    string            `json:"text,omitempty"`
	Attrs   map[string]any    `json:"attrs,omitempty"`
	Content []tiptapNode      `json:"content,omitempty"`
	Marks   []map[string]any  `json:"marks,omitempty"`
}

// ExtractTextFromTipTap converte o conteúdo JSON do TipTap em texto puro,
// preservando a estrutura (headings viram "## Título", listas ficam com "• item").
func ExtractTextFromTipTap(rawContent json.RawMessage) string {
	if len(rawContent) == 0 {
		return ""
	}

	var root tiptapNode
	if err := json.Unmarshal(rawContent, &root); err != nil {
		return ""
	}

	var sb strings.Builder
	extractNode(&sb, root, 0)
	return strings.TrimSpace(sb.String())
}

// extractNode percorre recursivamente os nós do árore TipTap e extrai o texto.
func extractNode(sb *strings.Builder, node tiptapNode, depth int) {
	switch node.Type {
	case "doc":
		extractChildren(sb, node.Content, depth)

	case "heading":
		level := 1
		if node.Attrs != nil {
			if l, ok := node.Attrs["level"]; ok {
				switch v := l.(type) {
				case float64:
					level = int(v)
				case int:
					level = v
				}
			}
		}
		prefix := strings.Repeat("#", level) + " "
		sb.WriteString(prefix)
		extractChildren(sb, node.Content, depth)
		sb.WriteString("\n\n")

	case "paragraph":
		extractChildren(sb, node.Content, depth)
		sb.WriteString("\n\n")

	case "text":
		sb.WriteString(node.Text)

	case "hardBreak":
		sb.WriteString("\n")

	case "bulletList":
		extractChildren(sb, node.Content, depth)
		sb.WriteString("\n")

	case "orderedList":
		for i, child := range node.Content {
			sb.WriteString(fmt.Sprintf("%d. ", i+1))
			extractChildren(sb, child.Content, depth+1)
			sb.WriteString("\n")
		}
		sb.WriteString("\n")

	case "listItem":
		sb.WriteString("• ")
		extractChildren(sb, node.Content, depth+1)

	case "blockquote":
		for _, child := range node.Content {
			sb.WriteString("> ")
			extractNode(sb, child, depth)
		}

	case "codeBlock":
		sb.WriteString("```\n")
		extractChildren(sb, node.Content, depth)
		sb.WriteString("```\n\n")

	case "horizontalRule":
		sb.WriteString("---\n\n")

	case "table":
		extractChildren(sb, node.Content, depth)
		sb.WriteString("\n")

	case "tableRow":
		for _, cell := range node.Content {
			sb.WriteString("| ")
			extractChildren(sb, cell.Content, depth)
			sb.WriteString(" ")
		}
		sb.WriteString("|\n")

	case "details", "summary":
		// Suporte ao bloco collapsible customizado
		extractChildren(sb, node.Content, depth)
		sb.WriteString("\n")

	default:
		// Nó desconhecido — extrai o texto dos filhos de qualquer forma
		extractChildren(sb, node.Content, depth)
	}
}

// extractChildren percorre os filhos de um nó.
func extractChildren(sb *strings.Builder, children []tiptapNode, depth int) {
	for _, child := range children {
		extractNode(sb, child, depth)
	}
}
