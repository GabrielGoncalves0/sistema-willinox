import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

interface ModalHelpButtonProps {
  title: string;
  content: React.ReactNode;
}

const ModalHelpButton: React.FC<ModalHelpButtonProps> = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Ajuda">
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{
            padding: '4px',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          <HelpIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalHelpButton;
