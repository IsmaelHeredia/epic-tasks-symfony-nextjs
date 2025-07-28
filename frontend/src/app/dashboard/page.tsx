"use client";

import React, { useState, useEffect, useCallback } from "react";

import LayoutAdmin from "@/components/LayoutAdmin";

import { Button, Stack, Tooltip } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@mui/material";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RootState, AppDispatch } from "@/types/redux/global";
import { useSelector, useDispatch } from "react-redux";

import { useRouter, redirect } from "next/navigation";

import { FormTextField } from '@/components/CustomTextFields';
import TaskAccordionList from "@/components/TaskAccordionList";

import AddIcon from '@mui/icons-material/Add';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
});

import ModalTarea from '@/components/ModalTarea';
import ModalCategoria from "@/components/ModalCategoria";
import ReorderTasksModal from "@/components/ReorderTasksModal";

import { Tarea, TareaPayload, TareaListResponse } from "@/types/api";
import CustomIconButton from "@/components/CustomIconButton";

import PaginationControls from "@/components/PaginationControls";
import { createTarea, fetchTareas, updateTarea, updateTareaOrder, deleteTarea } from "@/services/tareaService";

import {
  setSearchPage,
} from "@/store/reducers/searchFiltersSlice";

function Dashboard() {

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.themes.mode);
  const theme = useTheme();

  const searchFilters = useSelector((state: RootState) => state.searchFilters);
  const { titulo, categoriaIds, page, limit, searchTrigger } = searchFilters;

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Tarea | null>(null);

  const [openCategoriasModal, setOpenCategoriasModal] = useState(false);
  const [openReorderModal, setOpenReorderModal] = useState(false);

  const loadTareas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: TareaListResponse = await fetchTareas({ titulo, categoriaIds, page, limit });
      setTareas(response.tareas);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error al cargar las tareas.");
      toast.error("Error al cargar las tareas.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
    } finally {
      setLoading(false);
    }
  }, [titulo, categoriaIds, page, limit, searchTrigger]);

  useEffect(() => {
    loadTareas();
    window.scrollTo(0, 0);
  }, [loadTareas]);

  const handlePageChange = (newPage: number) => {
    dispatch(setSearchPage(newPage));
  };

  const handleOpenModalForNewTask = () => {
    setTaskToEdit(null);
    setOpenModal(true);
  };

  const handleOpenModalForEdit = (task: Tarea) => {
    setTaskToEdit(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTaskToEdit(null);
  };

  const handleSaveTarea = async (data: TareaPayload) => {
    setActionLoading(true);
    try {
      if (taskToEdit) {
        await updateTarea(taskToEdit.id, data);
        toast.success("Tarea actualizada correctamente", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
      } else {
        await createTarea(data);
        toast.success("Tarea creada correctamente", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
      }
      loadTareas();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      toast.error("Error al guardar la tarea.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskToDelete: Tarea) => {
    setActionLoading(true);
    try {
      await deleteTarea(taskToDelete.id);
      toast.success("Tarea eliminada correctamente", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
      loadTareas();
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Error al eliminar la tarea.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
    } finally {
      setActionLoading(false);
    }
  };

  const moveTask = useCallback(async (currentIndex: number, newIndex: number) => {
    if (currentIndex < 0 || currentIndex >= tareas.length || newIndex < 0 || newIndex >= tareas.length) {
      return;
    }

    setActionLoading(true);

    const updatedTasks = [...tareas];
    const [movedTask] = updatedTasks.splice(currentIndex, 1);
    updatedTasks.splice(newIndex, 0, movedTask);

    const task1 = { ...updatedTasks[newIndex] };
    const task2 = { ...updatedTasks[currentIndex] };

    const originalOrder1 = task1.orden;
    const originalOrder2 = task2.orden;

    task1.orden = originalOrder2;
    task2.orden = originalOrder1;

    setTareas(updatedTasks);

    try {
      const payload1: TareaPayload = {
        titulo: task1.titulo,
        contenido: task1.contenido,
        orden: task1.orden,
        estadoId: task1.estado.id,
        prioridadId: task1.prioridad.id,
        categoriasId: task1.categorias.map(cat => cat.id),
        subtareas: task1.subtareas.map(sub => ({
          id: sub.id,
          titulo: sub.titulo,
          contenido: sub.contenido,
          orden: sub.orden,
          estadoId: sub.estado.id,
          prioridadId: sub.prioridad.id,
          categoriasId: sub.categorias.map(cat => cat.id)
        }))
      };

      const payload2: TareaPayload = {
        titulo: task2.titulo,
        contenido: task2.contenido,
        orden: task2.orden,
        estadoId: task2.estado.id,
        prioridadId: task2.prioridad.id,
        categoriasId: task2.categorias.map(cat => cat.id),
        subtareas: task2.subtareas.map(sub => ({
          id: sub.id,
          titulo: sub.titulo,
          contenido: sub.contenido,
          orden: sub.orden,
          estadoId: sub.estado.id,
          prioridadId: sub.prioridad.id,
          categoriasId: sub.categorias.map(cat => cat.id)
        }))
      };

      await Promise.all([
        updateTarea(task1.id, payload1),
        updateTarea(task2.id, payload2)
      ]);

      await loadTareas();
      toast.success("Orden de tarea actualizado.", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000) });
    } catch (error) {
      console.error("Error al actualizar el orden de las tareas:", error);
      toast.error("Error al actualizar el orden de las tareas", {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
      });
      await loadTareas();
    } finally {
      setActionLoading(false);
    }
  }, [tareas, loadTareas]);

  const handleMoveTaskUp = (index: number) => {
    moveTask(index, index - 1);
  };

  const handleMoveTaskDown = (index: number) => {
    moveTask(index, index + 1);
  };

  const handleReorderModalSaveSuccess = useCallback(() => {
    loadTareas();
  }, [loadTareas]);


  return (
    <LayoutAdmin>
      {(loading || actionLoading) && (
        <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <div style={{ marginTop: "60px", marginBottom: "20px" }}>
        <Stack direction="row" spacing={2}>

          <Tooltip title="Nueva Tarea">
            <CustomIconButton
              onClick={handleOpenModalForNewTask}
              sx={{
                width: 40,
                height: 40,
                padding: '4px',
                '& .MuiSvgIcon-root': {
                  fontSize: '30px',
                },
              }}
            >
              <AddIcon />
            </CustomIconButton>
          </Tooltip>

          <Button
            variant="contained"
            onClick={() => setOpenCategoriasModal(true)}
          >
            Gestionar Categorías
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpenReorderModal(true)}
            startIcon={<SwapVertIcon />}
          >
            Reordenar Tareas
          </Button>
        </Stack>

        <ModalTarea
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveTarea}
          initialTask={taskToEdit}
        />

        <ModalCategoria
          open={openCategoriasModal}
          onClose={() => setOpenCategoriasModal(false)}
        />

        <ReorderTasksModal
          open={openReorderModal}
          onClose={() => setOpenReorderModal(false)}
          onSaveSuccess={handleReorderModalSaveSuccess}
        />
      </div>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : tareas.length === 0 && !loading ? (
        <Alert severity="info">No se encontraron tareas con los filtros aplicados</Alert>
      ) : (
        <TaskAccordionList
          tasks={tareas}
          loading={loading || actionLoading}
          onEditTask={handleOpenModalForEdit}
          onDeleteTask={handleDeleteTask}
          onMoveTaskUp={handleMoveTaskUp}
          onMoveTaskDown={handleMoveTaskDown}
        />
      )}

      <Stack spacing={2} sx={{ mb: 8, mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Stack>
    </LayoutAdmin>
  );
}

export default Dashboard;