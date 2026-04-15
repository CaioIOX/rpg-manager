import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionList from '@/app/campaigns/[id]/docs/[docId]/_components/MentionList';
import { useQueryClient } from '@tanstack/react-query';
import { DocumentSummary } from '@/lib/types/Documents';

export default function useMentionSuggestion(campaignId: string, docId: string) {
  const queryClient = useQueryClient();

  return {
    items: ({ query }: { query: string }) => {
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const documents = queryClient.getQueryData<DocumentSummary[]>(['documents', campaignId]) || [];
      return documents
        .filter((item) => item.id !== docId && normalize(item.title).includes(normalize(query)))
        .slice(0, 5);
    },
    render: () => {
      let component: ReactRenderer;
      let popup: any;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: 'dark'
          });
        },
        onUpdate(props: any) {
          component.updateProps(props);
          if (!props.clientRect) {
            return;
          }
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return (component.ref as any)?.onKeyDown(props);
        },
        onExit() {
          if (popup && popup.length > 0) {
              popup[0].destroy();
          }
          component.destroy();
        },
      };
    },
  };
}
