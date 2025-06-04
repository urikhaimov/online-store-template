import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const storeOptions = [
  { id: 'tech-store', label: 'Tech Store' },
  { id: 'fashion-boutique', label: 'Fashion Boutique' },
];

const StoreSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStore = new URLSearchParams(location.search).get('store') || 'tech-store';

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newStore = event.target.value;
    const params = new URLSearchParams(location.search);
    params.set('store', newStore);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });

    // Optional: force a full reload if your config is static at bootstrap
    window.location.reload();
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200, mt: 2 }}>
      <InputLabel id="store-switcher-label">Select Store</InputLabel>
      <Select
        labelId="store-switcher-label"
        value={currentStore}
        label="Select Store"
        onChange={handleChange}
      >
        {storeOptions.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StoreSwitcher;
