// ControlledTextField.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type Props = {
  name: string;
  control: any;
  label: string;
  type?: string;
  rules?: any;
  inputProps?: any;
  onChangeFormat?: (value: string) => string;
};

export default function ControlledTextField({
  name,
  control,
  label,
  type = 'text',
  rules,
  inputProps,
  onChangeFormat,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          error={!!error}
          helperText={error?.message}
          inputProps={inputProps}
          onChange={(e) => {
            const raw = e.target.value;
            const formatted = onChangeFormat ? onChangeFormat(raw) : raw;
            field.onChange(formatted);
          }}
          value={field.value || ''}
        />
      )}
    />
  );
}
