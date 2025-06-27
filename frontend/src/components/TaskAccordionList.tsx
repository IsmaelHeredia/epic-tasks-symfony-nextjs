"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  useTheme,
  CircularProgress,
  Backdrop,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Theme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';

import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import ArchiveIcon from '@mui/icons-material/Archive';

import { Estado, Prioridad, Tarea } from "@/types/api";
import CustomIconButton from "@/components/CustomIconButton";

interface TaskAccordionListProps {
  tasks: Tarea[];
  loading: boolean;
  onEditTask: (task: Tarea) => void;
  onDeleteTask: (task: Tarea) => void;
  onMoveTaskUp: (index: number) => void;
  onMoveTaskDown: (index: number) => void;
}

type PaletteColorKey =
  | 'info.main'
  | 'warning.main'
  | 'success.main'
  | 'error.main'
  | 'text.disabled'
  | 'primary.light'
  | 'warning.dark'
  | 'error.dark'
  | 'text.secondary'
  | 'action.disabledBackground'
  | `grey.${400}`;

const getPaletteColor = (theme: Theme, colorKey: PaletteColorKey) => {
  const parts = colorKey.split('.');

  if (parts.length === 2) {
    const [category, shade] = parts;
    if (category === 'grey' && !isNaN(parseInt(shade))) {
      return (theme.palette as any)[category][parseInt(shade)];
    }
    if ((theme.palette as any)[category] && (theme.palette as any)[category][shade]) {
      return (theme.palette as any)[category][shade];
    }
  } else if (parts.length === 1) {
    const category = parts[0];
    if ((theme.palette as any)[category]) {
      return (theme.palette as any)[category];
    }
  }
  return 'inherit';
};

const TaskAccordionList: React.FC<TaskAccordionListProps> = ({
  tasks,
  loading,
  onEditTask,
  onDeleteTask,
  onMoveTaskUp,
  onMoveTaskDown,
}) => {
  const theme = useTheme();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Tarea | null>(null);

  const handleOpenConfirmDialog = (task: Tarea) => {
    setTaskToDelete(task);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setTaskToDelete(null);
  };

  const handleConfirmDeleteAndPropagate = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete);
      handleCloseConfirmDialog();
    }
  };

  const getStatusIcon = (estado: Estado) => {
    let icon = null;
    let colorKey: PaletteColorKey = 'text.secondary';

    switch (estado.nombre.toLowerCase()) {
      case 'pendiente':
        icon = <PendingActionsIcon />;
        colorKey = 'info.main';
        break;
      case 'en progreso':
        icon = <HourglassEmptyIcon />;
        colorKey = 'warning.main';
        break;
      case 'completada':
        icon = <CheckCircleIcon />;
        colorKey = 'success.main';
        break;
      case 'bloqueada':
        icon = <BlockIcon />;
        colorKey = 'error.main';
        break;
      case 'archivada':
        icon = <ArchiveIcon />;
        colorKey = 'text.disabled';
        break;
      default:
        return null;
    }

    return (
      <Tooltip title={estado.nombre} arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', color: getPaletteColor(theme, colorKey) }}>
          {icon}
        </Box>
      </Tooltip>
    );
  };

  const getPriorityChip = (prioridad: Prioridad) => {
    let backgroundColor: string;
    let textColor: string;

    switch (prioridad.nombre.toLowerCase()) {
      case 'baja':
        backgroundColor = theme.palette.info.light;
        textColor = theme.palette.getContrastText(theme.palette.info.light);
        break;
      case 'media':
        backgroundColor = theme.palette.grey[400];
        textColor = theme.palette.getContrastText(theme.palette.grey[400]);
        break;
      case 'alta':
        backgroundColor = theme.palette.warning.main;
        textColor = theme.palette.getContrastText(theme.palette.warning.main);
        break;
      case 'urgente':
        backgroundColor = theme.palette.error.main;
        textColor = theme.palette.getContrastText(theme.palette.error.main);
        break;
      case 'crítica':
        backgroundColor = theme.palette.error.dark;
        textColor = theme.palette.getContrastText(theme.palette.error.dark);
        break;
      default:
        backgroundColor = theme.palette.action.disabledBackground;
        textColor = theme.palette.text.secondary;
    }

    return (
      <Chip
        label={prioridad.nombre}
        size="small"
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          fontWeight: 'bold',
          height: '20px'
        }}
      />
    );
  };

  return (
    <Box sx={{ maxHeight: 'calc(100vh - 270px)', overflowY: 'auto', pr: 1 }}>
      <Stack spacing={2}>
        {tasks
          .map((task, index) => (
            <Accordion key={task.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
                    {getStatusIcon(task.estado)}
                  </Stack>

                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          textDecoration: task.estado.nombre.toLowerCase() === 'completada' ? 'line-through' : 'none',
                          opacity: task.estado.nombre.toLowerCase() === 'completada' ? 0.6 : 1,
                        }}
                      >
                        {task.titulo}
                      </Typography>
                      {getPriorityChip(task.prioridad)}
                    </Stack>

                    <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                      {task.categorias.map((cat) => (
                        <Chip key={cat.id} label={cat.nombre} size="small" color="primary"
                          variant="outlined" />
                      ))}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onMoveTaskUp(index);
                      }}
                      size="small"
                      disabled={index === 0}
                      sx={{ color: theme.palette.info.main }}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onMoveTaskDown(index);
                      }}
                      size="small"
                      disabled={index === tasks.length - 1}
                      sx={{ color: theme.palette.info.main }}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onEditTask(task);
                      }}
                      size="small"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleOpenConfirmDialog(task);
                      }}
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2 }}
              >
                <Stack spacing={1.5}>
                  {task.subtareas
                    ?.sort((a, b) => (a.orden || 0) - (b.orden || 0))
                    .map((sub) => (
                      <Box
                        key={sub.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
                          {getStatusIcon(sub.estado)}
                        </Stack>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                              fontWeight={500}
                              sx={{
                                textDecoration: sub.estado.nombre.toLowerCase() === 'completada' ? 'line-through' : 'none',
                                opacity: sub.estado.nombre.toLowerCase() === 'completada' ? 0.6 : 1,
                              }}
                            >
                              {sub.titulo}
                            </Typography>
                            {getPriorityChip(sub.prioridad)}
                          </Stack>
                          <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                            {sub.categorias.map((cat) => (
                              <Chip
                                key={cat.id}
                                label={cat.nombre}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}

        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              ¿Estás seguro de que quieres eliminar la tarea "
              **{taskToDelete?.titulo}**"? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDeleteAndPropagate} color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default TaskAccordionList;