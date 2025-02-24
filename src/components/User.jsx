import { Button, Card, CardContent, Typography } from '@mui/material';

const User = () => {
    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', mt: 5 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Dummy User Component
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This is a dummy component using Material UI.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Click me!
                </Button>
            </CardContent>
        </Card>
    );
};

export default User;