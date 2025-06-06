import { useQuery } from '@tanstack/react-query';
import { FixedSizeList as List } from 'react-window';
import { Box, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../api/firebase'; // Adjust the import path as necessary
interface User {
  id: string;
  email: string;
  role: string;
}

export async function fetchUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email || '',
      role: data.role || '',
    };
  });
}

export default function AdminUsersPage() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading users</Typography>;

  return (
    <List
      height={600}
      width="100%"
      itemCount={users.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <Box style={style} key={users[index].id} sx={{ p: 1, borderBottom: '1px solid #ddd' }}>
          <Typography variant="subtitle1">{users[index].email}</Typography>
          <Typography variant="body2">Role: {users[index].role}</Typography>
        </Box>
      )}
    </List>
  );
}
