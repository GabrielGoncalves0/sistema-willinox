'use client';

import { TextField, MenuItem, Autocomplete, TextFieldProps } from '@mui/material';
import { Field, FieldProps } from 'formik';

interface Option {
  id: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  options: Option[];
  autocomplete?: boolean;
  multiple?: boolean;
}

/**
 * Componente reutilizável para campos de seleção com Formik
 * Suporta select simples e autocomplete
 */
export const SelectField = ({ 
  name, 
  options, 
  autocomplete = false, 
  multiple = false,
  ...textFieldProps 
}: SelectFieldProps) => {
  if (autocomplete) {
    return (
      <Field name={name}>
        {({ field, form, meta }: FieldProps) => (
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            getOptionDisabled={(option) => option.disabled || false}
            value={options.find(option => option.id === field.value) || null}
            onChange={(_, newValue) => {
              if (multiple) {
                form.setFieldValue(field.name, Array.isArray(newValue) ? newValue.map(opt => opt.id) : []);
              } else {
                form.setFieldValue(field.name, newValue ? (newValue as Option).id : '');
              }
            }}
            multiple={multiple}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textFieldProps}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          />
        )}
      </Field>
    );
  }

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <TextField
          {...textFieldProps}
          {...field}
          select
          value={field.value || ''}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
        >
          {options.map((option) => (
            <MenuItem 
              key={option.id} 
              value={option.id}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Field>
  );
};
