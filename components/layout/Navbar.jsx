import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
  Logout, AccountCircle, Assignment,
} from '@mui/icons-material';
import { logoutUser } from '../../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    await dispatch(logoutUser());
  };

  // Inicial del email para el Avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo + Nombre */}
        <Box display="flex" alignItems="center" gap={1}>
          <Assignment sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: '-0.5px' }}
          >
            Mis Tareas
          </Typography>
        </Box>

        {/* Usuario + Menú */}
        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
            >
              {user.email}
            </Typography>

            <Tooltip title="Mi cuenta">
              <IconButton onClick={handleOpenMenu} size="small">
                <Avatar
                  sx={{
                    width: 36, height: 36,
                    bgcolor: 'primary.main',
                    fontSize: 14, fontWeight: 700,
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2 } }}
            >
              <Box px={2} py={1}>
                <Typography variant="caption" color="text.secondary">
                  Sesión iniciada como
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ gap: 1, color: 'error.main', mt: 0.5 }}>
                <Logout fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;