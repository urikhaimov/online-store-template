import { useEffect, useState } from 'react';
import { subscribeToLogs, LogEntry } from '../../../api/logs';
import { Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToLogs((fetchedLogs) => {
            setLogs(fetchedLogs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Admin Logs
            </Typography>
            {logs.length === 0 ? (
                <Typography>No logs found.</Typography>
            ) : (
                <Paper>
                    <List>
                        {logs.map((log) => (
                            <ListItem key={log.id}>
                                <ListItemText
                                    primary={`${log.action} by ${log.adminId}`}
                                    secondary={new Date(log.timestamp.seconds * 1000).toLocaleString()}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
