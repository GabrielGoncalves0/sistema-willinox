'use client';

import { DialogActions, Button } from '@mui/material';
import { useFormikContext } from 'formik';

interface FormActionsProps {
  onCancel: () => void;
  cancelText?: string;
  submitText?: string;
  isEditing?: boolean;
  disabled?: boolean;
}

/**
 * Componente reutilizável para ações de formulário (Cancelar/Salvar)
 * Integrado com Formik para controle de estado de submissão
 */
export const FormActions = ({ 
  onCancel, 
  cancelText = 'Cancelar',
  submitText,
  isEditing = false,
  disabled = false
}: FormActionsProps) => {
  const { isSubmitting } = useFormikContext();
  
  const defaultSubmitText = isEditing ? 'Salvar Alterações' : 'Cadastrar';
  
  return (
    <DialogActions sx={{ mt: 2 }}>
      <Button onClick={onCancel} disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isSubmitting || disabled}
      >
        {submitText || defaultSubmitText}
      </Button>
    </DialogActions>
  );
};
