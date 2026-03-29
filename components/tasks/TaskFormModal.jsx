import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, IconButton,
  CircularProgress, Alert,
} from '@mui/material';
import { Close, Add, Edit } from '@mui/icons-material';
import { createTask } from '../../features/tasks/tasksSlice';
import { updateTask } from '../../features/tasks/tasksSlice';

const TaskFormModal = ({ open, onClose, taskToEdit = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.tasks);

  const isEditing = Boolean(taskToEdit);

  const [form, setForm] = useState({ title: '', description: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Si viene una tarea para editar, precargamos los campos
  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title ?? '',
        description: taskToEdit.description ?? '',
      });
    } else {
      setForm({ title: '', description: '' });
    }
    setFieldErrors({});
  }, [taskToEdit, open]);

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'El título es requerido.';
    else if (form.title.trim().length < 3) errors.title = 'Mínimo 3 caracteres.';
    else if (form.title.trim().length > 80) errors.title = 'Máximo 80 caracteres.';
    if (form.description.length > 300) errors.description = 'Máximo 300 caracteres.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      if (isEditing) {
        // Actualizar: solo enviamos los campos que cambiaron
        await dispatch(updateTask({
          id: taskToEdit.id,
          changes: {
            title: form.title.trim(),
            description: form.description.trim(),
          },
        }));
      } else {
        // Crear nueva tarea
        await dispatch(createTask({
          title: form.title.trim(),
          description: form.description.trim(),
          userId: user.uid,
        }));
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // no cerrar mientras se procesa
    setForm({ title: '', description: '' });
    setFieldErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {isEditing
              ? <Edit fontSize="small" color="primary" />
              : <Add fontSize="small" color="primary" />
            }
            <Typography variant="h6">
              {isEditing ? 'Editar tarea' : 'Nueva tarea'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenido */}
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            Error al guardar la tarea. Intenta nuevamente.
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2.5}>
          <TextField
            name="title"
            label="Título"
            value={form.title}
            onChange={handleChange}
            error={!!fieldErrors.title}
            helperText={fieldErrors.title || `${form.title.length}/80`}
            inputProps={{ maxLength: 80 }}
            autoFocus
            disabled={loading}
          />

          <TextField
            name="description"
            label="Descripción (opcional)"
            value={form.description}
            onChange={handleChange}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description || `${form.description.length}/300`}
            multiline
            rows={4}
            inputProps={{ maxLength: 300 }}
            disabled={loading}
          />
        </Box>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 2, minWidth: 120 }}
        >
          {loading
            ? <CircularProgress size={20} color="inherit" />
            : isEditing ? 'Guardar cambios' : 'Crear tarea'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;