import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

import { fetchAllTareas, updateMultipleTareasOrder, ReorderTasksPayload } from '@/services/tareaService';
import { Tarea, TareaListResponse } from '@/types/api';

interface ReorderTasksModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 700, md: 800 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
};

const listContainerStyle = {
  flexGrow: 1,
  overflowY: 'auto',
  mt: 2,
  mb: 2,
  pr: 1,
};

interface TareaReorderItemProps {
  tarea: Tarea;
  index: number;
  totalTareas: number;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  onMoveToTop: (id: number) => void;
  onMoveToBottom: (id: number) => void;
  isSaving: boolean;
}

const TareaReorderItem: React.FC<TareaReorderItemProps> = ({
  tarea,
  index,
  totalTareas,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
  isSaving,
}) => {
  const theme = useTheme();

  return (
    <ListItem
      key={tarea.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        gap: 1,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <ListItemText
        primary={tarea.titulo || `Tarea sin título (${tarea.id})`}
        primaryTypographyProps={{
          sx: {
            fontWeight: 'medium',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: { xs: 'calc(100% - 180px)', sm: 'calc(100% - 50px)' },
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          aria-label="move-to-top"
          onClick={() => onMoveToTop(tarea.id)}
          disabled={index === 0 || isSaving}
          sx={{ color: theme.palette.info.main }}
        >
          <KeyboardDoubleArrowUpIcon />
        </IconButton>
        <IconButton
          aria-label="move-up"
          onClick={() => onMoveUp(tarea.id)}
          disabled={index === 0 || isSaving}
          sx={{ color: theme.palette.info.main }}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          aria-label="move-down"
          onClick={() => onMoveDown(tarea.id)}
          disabled={index === totalTareas - 1 || isSaving}
          sx={{ color: theme.palette.info.main }}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton
          aria-label="move-to-bottom"
          onClick={() => onMoveToBottom(tarea.id)}
          disabled={index === totalTareas - 1 || isSaving}
          sx={{ color: theme.palette.info.main }}
        >
          <KeyboardDoubleArrowArrowDownIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

const ReorderTasksModal: React.FC<ReorderTasksModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const [originalTasks, setOriginalTasks] = useState<Tarea[]>([]);
  const [reorderedTasks, setReorderedTasks] = useState<Tarea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchAllTareas()
        .then((response: TareaListResponse) => {
          const fetchedTasks = Array.isArray(response.tareas) ? response.tareas : [];
          fetchedTasks.sort((a, b) => (a.orden || 0) - (b.orden || 0));
          setOriginalTasks(fetchedTasks);
          setReorderedTasks([...fetchedTasks]);
        })
        .catch(error => {
          console.error("Error al cargar las tareas:", error);
          toast.error("Error al cargar las tareas para reordenar.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open]);

  const handleMoveUp = useCallback((id: number) => {
    setReorderedTasks(prevTasks => {
      const index = prevTasks.findIndex(t => t.id === id);
      if (index > 0) {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(index, 1);
        newTasks.splice(index - 1, 0, movedTask);
        return newTasks;
      }
      return prevTasks;
    });
  }, []);

  const handleMoveDown = useCallback((id: number) => {
    setReorderedTasks(prevTasks => {
      const index = prevTasks.findIndex(t => t.id === id);
      if (index < prevTasks.length - 1) {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(index, 1);
        newTasks.splice(index + 1, 0, movedTask);
        return newTasks;
      }
      return prevTasks;
    });
  }, []);

  const handleMoveToTop = useCallback((id: number) => {
    setReorderedTasks(prevTasks => {
      const index = prevTasks.findIndex(t => t.id === id);
      if (index > 0) {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(index, 1);
        newTasks.unshift(movedTask);
        return newTasks;
      }
      return prevTasks;
    });
  }, []);

  const handleMoveToBottom = useCallback((id: number) => {
    setReorderedTasks(prevTasks => {
      const index = prevTasks.findIndex(t => t.id === id);
      if (index < prevTasks.length - 1) {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(index, 1);
        newTasks.push(movedTask);
        return newTasks;
      }
      return prevTasks;
    });
  }, []);


  const handleCancel = useCallback(() => {
    setReorderedTasks([...originalTasks]);
    onClose();
  }, [originalTasks, onClose]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const tasksToUpdate: ReorderTasksPayload[] = reorderedTasks.map((task, index) => ({
        id: task.id,
        orden: index + 1,
      }));

      await updateMultipleTareasOrder(tasksToUpdate);

      toast.success("Orden de tareas actualizado correctamente.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
      setOriginalTasks([...reorderedTasks]);
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar el orden de las tareas:", error);
      toast.error("Error al guardar el orden de las tareas.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
    } finally {
      setIsSaving(false);
    }
  }, [reorderedTasks, onSaveSuccess, onClose]);

  return (
    <Modal
      open={open}
      onClose={isSaving ? undefined : handleCancel}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          width: '100%',
          minHeight: '48px'
        }}>
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mt: 3,
              textAlign: 'center',
              flexGrow: 1,
              mr: 5
            }}
          >
            Reordenar Tareas
          </Typography>

          {!isSaving && (
            <IconButton
              onClick={handleCancel}
              aria-label="close-modal"
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                mt: 1,
                mr: 1
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Divider />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando tareas...</Typography>
          </Box>
        ) : (
          <Box sx={listContainerStyle}>
            {reorderedTasks.length === 0 ? (
              <Typography sx={{ textAlign: 'center', mt: 4, color: theme.palette.text.secondary }}>
                No hay tareas para reordenar.
              </Typography>
            ) : (
              <List>
                {reorderedTasks.map((tarea, index) => (
                  <TareaReorderItem
                    key={tarea.id}
                    tarea={tarea}
                    index={index}
                    totalTareas={reorderedTasks.length}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onMoveToTop={handleMoveToTop}
                    onMoveToBottom={handleMoveToBottom}
                    isSaving={isSaving}
                  />
                ))}
              </List>
            )}
          </Box>
        )}
        <Divider sx={{ mt: 'auto' }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSaving}
            startIcon={<CancelIcon />}
            sx={{
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || isLoading || reorderedTasks.length === 0}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ReorderTasksModal;