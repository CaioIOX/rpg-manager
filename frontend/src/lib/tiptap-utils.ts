/**
 * Utility: merge class names, filtering out falsy values.
 * Usado pelos componentes tiptap-ui-primitive (Toolbar, Separator).
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ")
}
