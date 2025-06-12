import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { RHFError } from '../types/RHFError';

type Props = TextFieldProps & {
  label: string;
  register: any;
  errorObject?: RHFError; // renamed to avoid conflict with MUI's `error` prop
};

const FormTextField: React.FC<Props> = ({ label, register, errorObject, ...rest }) => (
  <TextField
    label={label}
    fullWidth
    error={!!errorObject}
    helperText={errorObject ? String(errorObject?.message) : ''}
    {...register}
    {...rest}
  />
);

export default FormTextField;
