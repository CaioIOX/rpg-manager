import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DocumentSummary } from '@/lib/types/Documents';

interface MentionListProps {
  items: DocumentSummary[];
  command: (item: { id: string; label: string }) => void;
}

const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.title });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items?.length) {
    return (
      <Box sx={{ p: 1, bgcolor: 'rgba(22, 27, 34, 0.95)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', color: 'text.secondary' }}>
        <Typography variant="body2">Nenhum documento encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0.5, bgcolor: 'rgba(22, 27, 34, 0.95)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: 200, maxHeight: 300, overflowY: 'auto' }}>
      {props.items.map((item, index) => (
        <Box
          key={item.id}
          onClick={() => selectItem(index)}
          sx={{
            px: 2,
            py: 1,
            cursor: 'pointer',
            borderRadius: '6px',
            bgcolor: index === selectedIndex ? 'rgba(186, 104, 200, 0.2)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(186, 104, 200, 0.1)' },
            transition: 'background-color 0.1s'
          }}
        >
          <Typography variant="body2" sx={{ color: '#fff' }}>{item.title}</Typography>
        </Box>
      ))}
    </Box>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
