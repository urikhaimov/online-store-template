import React from 'react';
import InputMask from 'react-input-mask';
import { TextField, TextFieldProps } from '@mui/material';
import { RHFError } from '../types/RHFError';

type Props = Omit<TextFieldProps, 'error'> & {
  label: string;
  mask: string;
  register: any;
  errorObject?: RHFError;
};

const FormMaskedInput: React.FC<Props> = ({ label, mask, register, errorObject, ...rest }) => (
  <InputMask mask={mask} {...register}>
    {(inputProps: any) => (
      <TextField
        {...inputProps}
        label={label}
        fullWidth
        error={!!errorObject}
        helperText={errorObject ? String(errorObject?.message) : ''}
        {...rest}
      />
    )}
  </InputMask>
);

export default FormMaskedInput;