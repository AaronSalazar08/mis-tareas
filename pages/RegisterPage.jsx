import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, Card, CardContent } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const { user, initialized } = useSelector((state) => state.auth);

  if (initialized && user) return <Navigate to="/tasks" replace />;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <RegisterForm />
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;