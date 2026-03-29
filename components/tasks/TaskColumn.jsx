import { Box, Typography, Paper, Chip } from '@mui/material';
import TaskCard from './TaskCard';

// Configuración visual por columna
const COLUMN_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    emptyText: 'No hay tareas pendientes',
  },
  in_progress: {
    label: 'En progreso',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    emptyText: 'No hay tareas en progreso',
  },
  done: {
    label: 'Finalizado',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    emptyText: 'No hay tareas finalizadas',
  },
};

const TaskColumn = ({ status, tasks }) => {
  const config = COLUMN_CONFIG[status];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: { xs: '100%', md: 280 },
        maxWidth: { md: 380 },
        borderRadius: 3,
        border: '2px solid',
        borderColor: config.borderColor,
        backgroundColor: config.bgColor,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header de la columna */}
      <Box
        px={2}
        py={1.5}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          borderBottom: '1px solid',
          borderColor: config.borderColor,
          backgroundColor: 'rgba(255,255,255,0.6)',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {/* Indicador de color */}
          <Box
            sx={{
              width: 10, height: 10,
              borderRadius: '50%',
              backgroundColor: config.color,
            }}
          />
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {config.label}
          </Typography>
        </Box>

        {/* Contador de tareas */}
        <Chip
          label={tasks.length}
          size="small"
          sx={{
            backgroundColor: config.color,
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            height: 22,
            minWidth: 28,
          }}
        />
      </Box>

      {/* Lista de tareas */}
      <Box
        px={1.5}
        py={1.5}
        sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 120,
          maxHeight: 'calc(100vh - 260px)',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: config.borderColor,
            borderRadius: 4,
          },
        }}
      >
        {tasks.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={100}
          >
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              {config.emptyText}
            </Typography>
          </Box>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default TaskColumn;