import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card, CardContent, Typography, Box, IconButton,
  Menu, MenuItem, Divider, Chip, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import {
  MoreVert, Edit, Delete, ArrowForward,
  ArrowBack, CheckCircle, RadioButtonUnchecked, Schedule,
} from '@mui/icons-material';
import { updateTask, deleteTask } from '../../features/tasks/tasksSlice';
import TaskFormModal from './TaskFormModal';

// Configuración visual de cada estado
const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: 'warning',
    icon: <RadioButtonUnchecked sx={{ fontSize: 14 }} />,
    next: 'in_progress',
    nextLabel: 'Mover a En progreso',
    prev: null,
  },
  in_progress: {
    label: 'En progreso',
    color: 'info',
    icon: <Schedule sx={{ fontSize: 14 }} />,
    next: 'done',
    nextLabel: 'Mover a Finalizado',
    prev: 'pending',
    prevLabel: 'Volver a Pendiente',
  },
  done: {
    label: 'Finalizado',
    color: 'success',
    icon: <CheckCircle sx={{ fontSize: 14 }} />,
    next: null,
    prev: 'in_progress',
    prevLabel: 'Volver a En progreso',
  },
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('es-CR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const config = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;

  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleChangeStatus = (newStatus) => {
    dispatch(updateTask({ id: task.id, changes: { status: newStatus } }));
    handleCloseMenu();
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          mb: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header de la card */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{
                lineHeight: 1.3,
                flex: 1,
                pr: 1,
                // Tachado si está finalizado
                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                color: task.status === 'done' ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>

            <Tooltip title="Opciones">
              <IconButton size="small" onClick={handleOpenMenu} sx={{ mt: -0.5, mr: -0.5 }}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Descripción */}
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              mb={1.5}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Footer: estado + fecha */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Chip
              label={config.label}
              color={config.color}
              size="small"
              icon={config.icon}
              sx={{ fontWeight: 600, fontSize: 11 }}
            />
            {task.createdAt && (
              <Typography variant="caption" color="text.secondary">
                {formatDate(task.createdAt)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
      >
        {/* Mover al estado siguiente */}
        {config.next && (
          <MenuItem onClick={() => handleChangeStatus(config.next)} sx={{ gap: 1 }}>
            <ArrowForward fontSize="small" color="primary" />
            <Typography variant="body2">{config.nextLabel}</Typography>
          </MenuItem>
        )}

        {/* Mover al estado anterior */}
        {config.prev && (
          <MenuItem onClick={() => handleChangeStatus(config.prev)} sx={{ gap: 1 }}>
            <ArrowBack fontSize="small" color="action" />
            <Typography variant="body2">{config.prevLabel}</Typography>
          </MenuItem>
        )}

        {(config.next || config.prev) && <Divider />}

        {/* Editar */}
        <MenuItem onClick={() => { setEditOpen(true); handleCloseMenu(); }} sx={{ gap: 1 }}>
          <Edit fontSize="small" color="action" />
          <Typography variant="body2">Editar tarea</Typography>
        </MenuItem>

        {/* Eliminar */}
        <MenuItem
          onClick={() => { setDeleteOpen(true); handleCloseMenu(); }}
          sx={{ gap: 1, color: 'error.main' }}
        >
          <Delete fontSize="small" />
          <Typography variant="body2" color="error">Eliminar tarea</Typography>
        </MenuItem>
      </Menu>

      {/* Modal de edición */}
      <TaskFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        taskToEdit={task}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 380 } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" />
            <Typography variant="h6">Eliminar tarea</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que deseas eliminar{' '}
            <strong>"{task.title}"</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;