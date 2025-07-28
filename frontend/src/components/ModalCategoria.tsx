import React, { useState, useEffect, memo, ReactNode } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  useTheme,
  DialogTitle,
  CircularProgress,
  Box
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

import { toast } from "react-toastify";

import { FormTextField } from "@/components/CustomTextFields";

import { Categoria } from "@/types/api";

import { fetchCategorias, createCategoria, updateCategoria, deleteCategoria } from "@/services/categoriaService";

import { useDispatch } from "react-redux";
import { setCategoriasDisponibles } from "@/store/reducers/searchFiltersSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/types/redux/global";


interface ModalCategoriaProps {
  open: boolean;
  onClose: () => void;
}

interface CategoriaFormInputs {
  nombreCategoria: string;
}

interface IconTextFieldProps {
  label: string;
  icon: ReactNode;
  multiline?: boolean;
  rows?: number;
  name: string;
  control: any;
  rules?: any;
  errors: any;
  disabled?: boolean;
}

const IconFormTextField: React.FC<IconTextFieldProps> = memo(({ label, icon, multiline, rows, name, control, rules, errors, disabled }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field }) => (
      <FormTextField
        {...field}
        label={label}
        fullWidth
        multiline={multiline}
        rows={rows}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
        }}
        error={!!errors[name]}
        helperText={errors[name] ? errors[name].message : ''}
        disabled={disabled}
      />
    )}
  />
));

export default function ModalCategoria({ open, onClose }: ModalCategoriaProps) {

  const theme = useTheme();
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();

  const [pantallaActual, setPantallaActual] = useState<"listaCategorias" | "nuevaCategoria" | "editarCategoria">(
    "listaCategorias"
  );
  const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);


  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    mensaje: "",
    onConfirm: () => { },
  });

  const {
    control: controlCategoria,
    handleSubmit: handleSubmitCategoria,
    reset: resetCategoria,
    setValue: setCategoriaValue,
    formState: { errors: errorsCategoria }
  } = useForm<CategoriaFormInputs>({
    defaultValues: {
      nombreCategoria: "",
    }
  });

  const cargarCategorias = async () => {
    setLoadingInitial(true);
    try {
      const res = await fetchCategorias();
      setTodasCategorias(res.categorias);
      dispatch(setCategoriasDisponibles(res.categorias));
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("Error al cargar las categorías.", {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
      });
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (open) {
      cargarCategorias();
      setPantallaActual("listaCategorias");
      setBusquedaCategoria("");
      resetCategoria();
      setLoading(false);
      setDeletingId(null);
    }
  }, [open, resetCategoria]);

  const obtenerTituloPantalla = () => {
    switch (pantallaActual) {
      case "listaCategorias": return "Gestionar Categorías";
      case "nuevaCategoria": return "Agregar Categoría";
      case "editarCategoria": return "Editar Categoría";
      default: return "Categorías";
    }
  };

  const agregarCategoriaSubmit: SubmitHandler<CategoriaFormInputs> = async (data) => {
    setLoading(true);
    const { nombreCategoria } = data;
    if (nombreCategoria) {
      if (todasCategorias.some(cat => cat.nombre.toLowerCase() === nombreCategoria.toLowerCase())) {
        toast.error("La categoría ya existe.");
        setLoading(false);
        return;
      }
      try {
        const response = await createCategoria({ nombre: nombreCategoria });
        const nuevaCat = response.categoria;
        const categoriasActualizadas = [...todasCategorias, nuevaCat];
        setTodasCategorias(categoriasActualizadas);
        dispatch(setCategoriasDisponibles(categoriasActualizadas));
        resetCategoria();
        setPantallaActual("listaCategorias");
        toast.success("Categoría agregada correctamente.");
      } catch (error) {
        console.error("Error al agregar categoría:", error);
        toast.error("Hubo un error al agregar la categoría.");
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicionCategoria = (categoria: Categoria) => {
    setCategoriaAEditar(categoria);
    setCategoriaValue("nombreCategoria", categoria.nombre);
    setPantallaActual("editarCategoria");
  };

  const guardarEdicionCategoriaSubmit: SubmitHandler<CategoriaFormInputs> = async (data) => {
    setLoading(true);
    const { nombreCategoria } = data;

    if (categoriaAEditar && nombreCategoria) {
      const categoriaConMismoNombreExiste = todasCategorias.some(
        cat => cat.nombre.toLowerCase() === nombreCategoria.toLowerCase() && cat.id !== categoriaAEditar.id
      );

      if (categoriaConMismoNombreExiste) {
        toast.error("Ya existe una categoría con ese nombre.");
        setLoading(false);
        return;
      }

      try {
        const response = await updateCategoria(categoriaAEditar.id, { nombre: nombreCategoria });
        const updatedCategoria = response.categoria;

        const categoriasActualizadas = todasCategorias.map(cat =>
          cat.id === updatedCategoria.id ? updatedCategoria : cat
        );
        setTodasCategorias(categoriasActualizadas);
        dispatch(setCategoriasDisponibles(categoriasActualizadas));

        resetCategoria();
        setCategoriaAEditar(null);
        setPantallaActual("listaCategorias");
        toast.success("Categoría editada correctamente.", {
          autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
        });
      } catch (error) {
        console.error("Error al editar categoría:", error);
        toast.error("Hubo un error al editar la categoría.", {
          autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmarEliminarCategoria = (categoria: Categoria) => {
    setConfirmDialog({
      open: true,
      mensaje: `¿Estás seguro de eliminar la categoría '${categoria.nombre}'?`,
      onConfirm: async () => {
        setDeletingId(categoria.id);
        setLoading(true);
        try {
          await deleteCategoria(categoria.id);
          const categoriasActualizadas = todasCategorias.filter(cat => cat.id !== categoria.id);
          setTodasCategorias(categoriasActualizadas);
          dispatch(setCategoriasDisponibles(categoriasActualizadas));
          setConfirmDialog({ ...confirmDialog, open: false });
          toast.success("Categoría eliminada correctamente.", {
            autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
          });
        } catch (error) {
          console.error("Error al eliminar categoría:", error);
          toast.error("Hubo un error al eliminar la categoría.", {
            autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
          });
          setConfirmDialog({ ...confirmDialog, open: false });
        } finally {
          setLoading(false);
          setDeletingId(null);
        }
      }
    });
  };

  const filteredCategorias = todasCategorias.filter(c =>
    c.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase())
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ position: 'relative', pt: 4 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={loading || loadingInitial}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mt: 3,
            textAlign: 'center',
            mb: 4
          }}
        >
          {obtenerTituloPantalla()}
        </Typography>

        {loadingInitial ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {pantallaActual === "listaCategorias" && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Buscar Categoría"
                  fullWidth
                  value={busquedaCategoria}
                  onChange={(e) => setBusquedaCategoria(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => { setPantallaActual("nuevaCategoria"); resetCategoria(); }}
                  disabled={loading}
                >
                  Nueva Categoría
                </Button>
                <List
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  {filteredCategorias.length > 0 ? (
                    filteredCategorias.map((cat) => (
                      <ListItem key={cat.id}>
                        <ListItemText primary={cat.nombre} />
                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="edit"
                            onClick={() => iniciarEdicionCategoria(cat)}
                            sx={{ color: theme.palette.primary.main }}
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                          <LoadingButton
                            aria-label="delete"
                            onClick={() => confirmarEliminarCategoria(cat)}
                            color="error"
                            sx={{ color: theme.palette.error.main }}
                            loading={loading && deletingId === cat.id}
                            disabled={loading}
                          >
                            {loading && deletingId === cat.id ? null : <DeleteIcon />}
                          </LoadingButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                      No hay categorías para mostrar.
                    </Typography>
                  )}
                </List>
              </Stack>
            )}

            {pantallaActual === "nuevaCategoria" && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <IconFormTextField
                  label="Nombre de la Categoría"
                  name="nombreCategoria"
                  control={controlCategoria}
                  rules={{
                    required: "El nombre de la categoría es requerido.",
                    validate: (value: string) => {
                      if (todasCategorias.some(cat => cat.nombre.toLowerCase() === value.toLowerCase())) {
                        return "La categoría ya existe.";
                      }
                      return true;
                    }
                  }}
                  errors={errorsCategoria}
                  icon={<LabelIcon />}
                  disabled={loading}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => { setPantallaActual("listaCategorias"); resetCategoria(); }}
                    disabled={loading}
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
                  <LoadingButton
                    variant="contained"
                    onClick={handleSubmitCategoria(agregarCategoriaSubmit)}
                    startIcon={<AddIcon />}
                    loading={loading}
                    disabled={loading}
                    loadingPosition="start"
                  >
                    Agregar Categoría
                  </LoadingButton>
                </Stack>
              </Stack>
            )}

            {pantallaActual === "editarCategoria" && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <IconFormTextField
                  label="Nombre de la Categoría"
                  name="nombreCategoria"
                  control={controlCategoria}
                  rules={{
                    required: "El nombre de la categoría es requerido.",
                    validate: (value: string | null) => {
                      const categoryName = value || '';
                      if (categoriaAEditar && categoryName.toLowerCase() === categoriaAEditar.nombre.toLowerCase()) return true;
                      if (todasCategorias.some(cat => cat.nombre.toLowerCase() === categoryName.toLowerCase())) {
                        return "Ya existe una categoría con ese nombre.";
                      }
                      return true;
                    }
                  }}
                  errors={errorsCategoria}
                  icon={<LabelIcon />}
                  disabled={loading}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => { setPantallaActual("listaCategorias"); resetCategoria(); }}
                    disabled={loading}
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
                  <LoadingButton
                    variant="contained"
                    onClick={handleSubmitCategoria(guardarEdicionCategoriaSubmit)}
                    startIcon={<EditIcon />}
                    loading={loading}
                    disabled={loading}
                    loadingPosition="start"
                  >
                    Guardar Cambios
                  </LoadingButton>
                </Stack>
              </Stack>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        {pantallaActual === "listaCategorias" && (
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading || loadingInitial}
            sx={{
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cerrar
          </Button>
        )}
      </DialogActions>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>Confirmar Acción</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            {confirmDialog.mensaje}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            color="primary"
            disabled={loading}
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
          <LoadingButton
            onClick={() => { confirmDialog.onConfirm(); }}
            color="error"
            autoFocus
            loading={loading}
            disabled={loading}
          >
            Confirmar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}