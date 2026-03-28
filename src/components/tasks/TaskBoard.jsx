import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Typography, CircularProgress,
  Alert, Fab, Tooltip,
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import { fetchTasks } from '../../features/tasks/tasksSlice';
import TaskColumn from './TaskColumn';
import TaskFormModal from './TaskFormModal';

const STATUSES = ['pending', 'in_progress', 'done'];

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error, loaded } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);

  // Cargar tareas al montar — solo si no están cargadas ya en Redux
  useEffect(() => {
    if (user?.uid && !loaded) {
      dispatch(fetchTasks(user.uid));
    }
  }, [user, loaded, dispatch]);

  // Filtrar tareas por estado para cada columna
  const getTasksByStatus = (status) =>
    items.filter((task) => task.status === status);

  const totalTasks = items.length;
  const doneTasks = items.filter((t) => t.status === 'done').length;

  const handleRefresh = () => {
    if (user?.uid) dispatch(fetchTasks(user.uid));
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Encabezado del board */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" color="text.primary">
            Mi tablero de tareas
          </Typography>
          {!loading && totalTasks > 0 && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {doneTasks} de {totalTasks} tareas completadas
            </Typography>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Recargar tareas">
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<Refresh />}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Recargar
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Nueva tarea
          </Button>
        </Box>
      </Box>

      {/* Estado: cargando */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" ml={2}>
            Cargando tareas...
          </Typography>
        </Box>
      )}

      {/* Estado: error */}
      {error && !loading && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }
        >
          Error al cargar las tareas. {error}
        </Alert>
      )}

      {/* Tablero Kanban: 3 columnas */}
      {!loading && (
        <Box
          display="flex"
          gap={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
        >
          {STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
            />
          ))}
        </Box>
      )}

      {/* FAB para móvil */}
      <Tooltip title="Nueva tarea">
        <Fab
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' },
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Modal para crear nueva tarea */}
      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default TaskBoard;