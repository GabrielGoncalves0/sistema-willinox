import React, { useState } from 'react';
import {
  Box,
  Collapse,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

interface HelpCollapseProps {
  title: string;
  content: React.ReactNode;
}

const HelpCollapse: React.FC<HelpCollapseProps> = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 2, position: 'relative' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mb: 1,
        paddingBottom: '4px',
        marginTop: '8px'
      }}>
        <Tooltip title="Ajuda">
          <IconButton
            onClick={() => setOpen(!open)}
            color={open ? 'primary' : 'default'}
            size="medium"
            sx={{
              padding: '4px',
              backgroundColor: open ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: open ? 'rgba(25, 118, 210, 0.15)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <HelpIcon sx={{
              fontSize: '24px',
              transform: open ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={open}>
        <Alert
          severity="info"
          sx={{
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <AlertTitle>{title}</AlertTitle>
          {content}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default HelpCollapse;
