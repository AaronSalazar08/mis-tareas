import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { loginUser, clearError } from '../../features/auth/authSlice';

// Traducciones de errores comunes de Firebase Auth
const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
};

const getErrorMessage = (error) => {
  if (!error) return null;
  const code = error.match(/\(([^)]+)\)/)?.[1];
  return FIREBASE_ERRORS[code] ?? 'Ocurrió un error. Intenta nuevamente.';
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.email) errors.email = 'El correo es requerido.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Correo inválido.';
    if (!form.password) errors.password = 'La contraseña es requerida.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate('/tasks');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={0.5} textAlign="center">
        Bienvenido de nuevo
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Inicia sesión para ver tus tareas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {getErrorMessage(error)}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 1, py: 1.5 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar sesión'}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
        ¿No tienes cuenta?{' '}
        <Link component={RouterLink} to="/register" fontWeight={600}>
          Regístrate aquí
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;