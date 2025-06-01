'use client';

import { Field, FieldProps } from 'formik';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { TextFieldProps } from '@mui/material';

interface DateFieldProps {
  name: string;
  label?: string;
  adjustTime?: boolean;
  disabled?: boolean;
  slotProps?: {
    textField?: Partial<TextFieldProps>;
  };
}

export const DateField = ({ name, adjustTime = true, label, disabled, slotProps }: DateFieldProps) => {
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DatePicker
            label={label}
            disabled={disabled}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              if (date) {
                if (adjustTime) {
                  const adjustedDate = new Date(date);
                  adjustedDate.setHours(12, 0, 0, 0);
                  form.setFieldValue(field.name, adjustedDate.toISOString());
                } else {
                  form.setFieldValue(field.name, date.toISOString());
                }
              } else {
                form.setFieldValue(field.name, null);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                readOnly: true,
                error: meta.touched && Boolean(meta.error),
                helperText: meta.touched && meta.error,
                ...slotProps?.textField,
              },
            }}
          />
        </LocalizationProvider>
      )}
    </Field>
  );
};
