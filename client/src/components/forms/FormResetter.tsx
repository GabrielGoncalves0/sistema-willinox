'use client';

import { useEffect } from 'react';
import { useFormikContext } from 'formik';

interface FormResetterProps {
  open: boolean;
  resetOnOpen?: boolean;
}

/**
 * Componente reutilizável para resetar formulários Formik
 * Usado em modais para limpar o formulário quando aberto/fechado
 */
export const FormResetter = ({ open, resetOnOpen = true }: FormResetterProps) => {
  const { resetForm, initialValues } = useFormikContext<any>();
  
  useEffect(() => {
    if (open && resetOnOpen) {
      resetForm({ values: initialValues });
    }
  }, [open, resetOnOpen, resetForm, initialValues]);
  
  return null;
};
