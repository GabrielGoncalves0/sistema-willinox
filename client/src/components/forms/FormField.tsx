'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { FormatString } from '@/utils/formatString';

interface FormFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  formatter?: 'nome' | 'endereco' | 'telefone' | 'cpf' | 'cnpj' | 'none';
}

/**
 * Componente reutilizável para campos de formulário com Formik
 * Inclui formatação automática baseada no tipo do campo
 */
export const FormField = ({ name, formatter = 'none', ...textFieldProps }: FormFieldProps) => {
  const getFormatter = (type: string) => {
    switch (type) {
      case 'nome':
        return FormatString.filtrarNome;
      case 'endereco':
        return FormatString.filtrarEndereco;
      case 'telefone':
        return FormatString.formatTelefone;
      case 'cpf':
        return FormatString.formatCPF;
      case 'cnpj':
        return FormatString.formatCNPJ;
      default:
        return (value: string) => value;
    }
  };

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <TextField
          {...textFieldProps}
          {...field}
          value={field.value || ''}
          onChange={(e) => {
            const formatFunction = getFormatter(formatter);
            const formattedValue = formatFunction(e.target.value);
            form.setFieldValue(field.name, formattedValue);
          }}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
        />
      )}
    </Field>
  );
};
