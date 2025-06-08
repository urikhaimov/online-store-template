import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';

interface StoreInfo {
  id: string;
  name: string;
  logo: string;
}

const STORES: StoreInfo[] = [
  { id: 'store1', name: 'Urban Outfitters', logo: '/logos/store1.png' },
  { id: 'store2', name: 'Gadget Hub', logo: '/logos/store2.png' },
  { id: 'store3', name: 'Fresh Mart', logo: '/logos/store3.png' },
];

 function StoreSwitcher({
  current,
  onChange,
}: {
  current: string;
  onChange: (newStoreId: string) => void;
}) {
  const [selected, setSelected] = useState(current);

  useEffect(() => {
    setSelected(current);
  }, [current]);

  const handleChange = (e: any) => {
    setSelected(e.target.value);
    onChange(e.target.value);
  };

  const activeStore = STORES.find((s) => s.id === selected) || STORES[0];

  return (
    <FormControl
      size="small"
      variant="outlined"
      sx={{
        minWidth: 40,
        ml: 1.5,
        '& .MuiInputBase-root': {
          height: 36,
          width: 36,
          borderRadius: '50%',
          bgcolor: 'white',
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 1,
        },
        '& .MuiSelect-icon': {
          display: 'none',
        },
      }}
    >
      <Select
        value={selected}
        onChange={handleChange}
        IconComponent={ExpandMoreIcon}
        displayEmpty
        renderValue={() => (
          <Tooltip title={activeStore.name}>
            <Avatar
              src={activeStore.logo}
              alt={activeStore.name}
              sx={{ width: 24, height: 24 }}
            />
          </Tooltip>
        )}
      >
        {STORES.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={store.logo} alt={store.name} sx={{ width: 24, height: 24 }} />
              {store.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
export default StoreSwitcher;
