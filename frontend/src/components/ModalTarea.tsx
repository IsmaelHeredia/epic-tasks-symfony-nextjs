import React, { useState, ReactNode, useEffect, memo, useCallback } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CategoryIcon from "@mui/icons-material/Category";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { toast } from "react-toastify";

import { FormTextField, FormSelect, FormAutocomplete } from "@/components/CustomTextFields";

import { Estado, Prioridad, Subtarea, Tarea, Categoria, TareaPayload } from "@/types/api";
import { fetchCategorias } from "@/services/categoriaService";
import { fetchPrioridades } from "@/services/prioridadService";
import { fetchEstados } from "@/services/estadoService";

export interface ModalTareaProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TareaPayload) => Promise<void>;
  initialTask?: Tarea | null;
}

interface TareaFormInputs {
  titulo: string;
  contenido: string;
  estado: Estado;
  prioridad: Prioridad;
  categorias: Categoria[];
}

type SubtareaFormInputs = {
  id?: number;
  titulo: string;
  contenido: string;
  estado: Estado;
  prioridad: Prioridad;
  categorias: Categoria[];
};

interface IconTextFieldProps {
  label: string;
  icon: ReactNode;
  multiline?: boolean;
  rows?: number;
  name: string;
  control: any;
  rules?: any;
  errors: any;
}

const IconFormTextField: React.FC<IconTextFieldProps> = memo(({ label, icon, multiline, rows, name, control, rules, errors }) => (
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
      />
    )}
  />
));

interface IconSelectProps {
  label: string;
  options: readonly (Estado | Prioridad)[];
  icon: ReactNode;
  name: string;
  control: any;
  rules?: any;
  errors: any;
}

const IconFormSelect: React.FC<IconSelectProps> = memo(({ label, options, icon, name, control, rules, errors }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormSelect
          {...field}
          label={label}
          value={field.value?.nombre || ''}
          onChange={(event) => {
            const selectedOption = options.find(opt => opt.nombre === event.target.value);
            if (selectedOption) {
              field.onChange(selectedOption);
            } else {
              field.onChange(null);
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          }
          error={!!errors[name]}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.nombre}>
              {option.nombre}
            </MenuItem>
          ))}
        </FormSelect>
      )}
    />
    {errors[name] && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{errors[name].message}</Typography>}
  </FormControl>
));

interface IconAutocompleteProps {
  label: string;
  options: Categoria[];
  icon: ReactNode;
  name: string;
  control: any;
  rules?: any;
  errors: any;
}

const IconFormAutocomplete: React.FC<IconAutocompleteProps> = memo(({ label, options, icon, name, control, rules, errors }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value, ...field } }) => (
      <FormAutocomplete<Categoria, true, false, false>
        {...field}
        multiple
        options={options}
        getOptionLabel={(option: Categoria) => option.nombre}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        value={value || []}
        onChange={(event: React.SyntheticEvent, newValue: Categoria[]) => onChange(newValue)}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...chipProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.nombre}
                {...chipProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    {icon}
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
            error={!!errors[name]}
            helperText={errors[name] ? errors[name].message : ''}
          />
        )}
      />
    )}
  />
));

export default function ModalTarea({ open, onClose, onSave, initialTask }: ModalTareaProps) {
  const [pantallaActual, setPantallaActual] = useState<
    "formulario" | "subtareas" | "nuevaSubtarea" | "editarSubtarea"
  >("formulario");

  const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
  const [todasPrioridades, setTodasPrioridades] = useState<Prioridad[]>([]);
  const [todosEstados, setTodosEstados] = useState<Estado[]>([]);
  const [subtareas, setSubtareas] = useState<Subtarea[]>([]);

  useEffect(() => {
    fetchCategorias().then((res) => setTodasCategorias(res.categorias)).catch(console.error);
    fetchPrioridades().then((res) => setTodasPrioridades(res.prioridades)).catch(console.error);
    fetchEstados().then((res) => setTodosEstados(res.estados)).catch(console.error);
  }, []);

  const [subtareaAEditar, setSubtareaAEditar] = useState<Subtarea | null>(null);
  const [busquedaSubtarea, setBusquedaSubtarea] = useState("");

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    mensaje: "",
    onConfirm: () => { },
  });

  const {
    control: controlTarea,
    handleSubmit: handleSubmitTarea,
    reset: resetTarea,
    setValue: setTareaValue,
    getValues: getTareaValues,
    formState: { errors: errorsTarea },
  } = useForm<TareaFormInputs>({
    defaultValues: {
      titulo: "",
      contenido: "",
      estado: { id: 0, nombre: "pendiente" },
      prioridad: { id: 0, nombre: "media" },
      categorias: []
    }
  });

  const {
    control: controlSubtarea,
    handleSubmit: handleSubmitSubtarea,
    reset: resetSubtarea,
    setValue: setSubtareaValue,
    getValues: getSubtareaValues,
    formState: { errors: errorsSubtarea },
  } = useForm<SubtareaFormInputs>({
    defaultValues: {
      titulo: "",
      contenido: "",
      estado: { id: 0, nombre: "pendiente" },
      prioridad: { id: 0, nombre: "media" },
      categorias: [],
    }
  });

  useEffect(() => {
    if (open) {
      if (initialTask) {
        resetTarea({
          titulo: initialTask.titulo,
          contenido: initialTask.contenido,
          estado: initialTask.estado,
          prioridad: initialTask.prioridad,
          categorias: initialTask.categorias || [],
        });
        setSubtareas(initialTask.subtareas || []);
      } else {
        const defaultEstado = todosEstados.find(e => e.nombre.toLowerCase() === "pendiente") || todosEstados[0] || { id: 0, nombre: "pendiente" };
        const defaultPrioridad = todasPrioridades.find(p => p.nombre.toLowerCase() === "media") || todasPrioridades[0] || { id: 0, nombre: "media" };

        resetTarea({
          titulo: "",
          contenido: "",
          estado: defaultEstado,
          prioridad: defaultPrioridad,
          categorias: [],
        });
        setSubtareas([]);
      }
      setPantallaActual("formulario");
    }
  }, [open, initialTask, resetTarea, todosEstados, todasPrioridades]); 

  useEffect(() => {
    setSubtareas(prevSubtareas =>
      [...prevSubtareas].sort((a, b) => (a.orden || 0) - (b.orden || 0))
    );
  }, [subtareas.length]);


  const obtenerTituloPantalla = () => {
    switch (pantallaActual) {
      case "formulario": return initialTask ? `Editar Tarea: ${initialTask.titulo}` : "Agregar Tarea";
      case "subtareas": return "Subtareas";
      case "nuevaSubtarea": return "Agregar Subtarea";
      case "editarSubtarea": return `Editar Subtarea: ${subtareaAEditar?.titulo || ''}`;
      default: return "Tarea";
    }
  };

  const agregarSubtareaSubmit: SubmitHandler<SubtareaFormInputs> = (data) => {
    const tempId = -(Date.now());
    const newOrder = subtareas.length > 0 ? Math.max(...subtareas.map(s => s.orden || 0)) + 1 : 1;
    setSubtareas(prev => [...prev, { ...data, id: tempId, orden: newOrder }]);
    resetSubtarea();
    setPantallaActual("subtareas");
  };

  const iniciarEdicionSubtarea = (sub: Subtarea) => {
    setSubtareaAEditar(sub);
    const formData: SubtareaFormInputs = {
      titulo: sub.titulo,
      contenido: sub.contenido,
      estado: sub.estado,
      prioridad: sub.prioridad,
      categorias: sub.categorias
    };
    (Object.keys(formData) as Array<keyof SubtareaFormInputs>).forEach((key) => {
      setSubtareaValue(key, formData[key] as any);
    });
    setPantallaActual("editarSubtarea");
  };

  const guardarEdicionSubtareaSubmit: SubmitHandler<SubtareaFormInputs> = (data) => {
    if (subtareaAEditar) {
      setSubtareas(subtareas.map(sub => (
        sub.id === subtareaAEditar.id
          ? {
            ...subtareaAEditar,
            ...data,
          }
          : sub
      )));
      resetSubtarea();
      setSubtareaAEditar(null);
      setPantallaActual("subtareas");
    }
  };

  const eliminarSubtarea = (id: number) => {
    const updatedSubtareas = subtareas.filter((sub) => sub.id !== id);
    setSubtareas(updatedSubtareas.map((sub, index) => ({ ...sub, orden: index + 1 })));
    setConfirmDialog({ ...confirmDialog, open: false });
    toast.info("Subtarea eliminada de la lista (se aplicará al guardar la tarea principal).", {
      autoClose: 2000,
    });
  };

  const moverSubtarea = (id: number, direction: 'up' | 'down') => {
    setSubtareas(prevSubtareas => {
      const newSubtareas = [...prevSubtareas].sort((a, b) => (a.orden || 0) - (b.orden || 0));
      const index = newSubtareas.findIndex(sub => sub.id === id);

      if (index === -1) return prevSubtareas;

      const subtareaToMove = newSubtareas[index];

      if (direction === 'up' && index > 0) {
        const subtareaAbove = newSubtareas[index - 1];
        newSubtareas[index - 1] = { ...subtareaToMove, orden: subtareaAbove.orden };
        newSubtareas[index] = { ...subtareaAbove, orden: subtareaToMove.orden };
      } else if (direction === 'down' && index < newSubtareas.length - 1) {
        const subtareaBelow = newSubtareas[index + 1];
        newSubtareas[index + 1] = { ...subtareaToMove, orden: subtareaBelow.orden };
        newSubtareas[index] = { ...subtareaBelow, orden: subtareaToMove.orden };
      }
      return newSubtareas.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    });
  };

  const guardarTareaSubmit: SubmitHandler<TareaFormInputs> = async (data) => {
    try {
      let tareaOrden: number | undefined;
      tareaOrden = initialTask?.orden ?? 0;

      const payload: TareaPayload = {
        titulo: data.titulo,
        contenido: data.contenido,
        orden: tareaOrden,
        estadoId: data.estado.id,
        prioridadId: data.prioridad.id,
        categoriasId: data.categorias.map(c => c.id),
        subtareas: subtareas.map(sub => ({
          id: sub.id && sub.id > 0 ? sub.id : undefined,
          titulo: sub.titulo,
          contenido: sub.contenido,
          orden: sub.orden,
          estadoId: sub.estado.id,
          prioridadId: sub.prioridad.id,
          categoriasId: sub.categorias.map(c => c.id)
        })),
      };

      console.log('Payload preparado para la tarea:', payload);

      await onSave(payload);

    } catch (error) {
      console.error("Error al preparar la tarea para guardar:", error);
      toast.error(`Error al preparar la tarea para guardar.`, {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
      });
    }
  };

  const filteredSubtareas = subtareas.filter(sub =>
    sub.titulo.toLowerCase().includes(busquedaSubtarea.toLowerCase())
  ).sort((a, b) => (a.orden || 0) - (b.orden || 0));

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ pl: pantallaActual !== "formulario" ? 6 : 2 }}>
          {pantallaActual !== "formulario" && (
            <IconButton onClick={() => {
              if (pantallaActual === "nuevaSubtarea" || pantallaActual === "editarSubtarea") {
                setPantallaActual("subtareas");
                resetSubtarea();
              }
              else {
                setPantallaActual("formulario");
              }
            }} sx={{ position: "absolute", top: 8, left: 8 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography component="span" variant="h6" sx={{ ml: pantallaActual !== "formulario" ? 5 : 0 }}>
            {obtenerTituloPantalla()}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {pantallaActual === "formulario" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <IconFormTextField
                label="Título"
                name="titulo"
                control={controlTarea}
                rules={{ required: "El título es requerido." }}
                errors={errorsTarea}
                icon={<TitleIcon />}
              />
              <IconFormTextField
                label="Contenido"
                name="contenido"
                control={controlTarea}
                rules={{}}
                errors={errorsTarea}
                multiline
                rows={4}
                icon={<DescriptionIcon />}
              />
              <Grid container>
                <Grid item xs={6} sx={{ pr: 1 }}>
                  <IconFormSelect
                    label="Estado"
                    name="estado"
                    control={controlTarea}
                    rules={{ required: "El estado es requerido." }}
                    errors={errorsTarea}
                    options={todosEstados}
                    icon={<AssignmentTurnedInIcon />}
                  />
                </Grid>
                <Grid item xs={6} sx={{ pl: 1 }}>
                  <IconFormSelect
                    label="Prioridad"
                    name="prioridad"
                    control={controlTarea}
                    rules={{ required: "La prioridad es requerida." }}
                    errors={errorsTarea}
                    options={todasPrioridades}
                    icon={<PriorityHighIcon />}
                  />
                </Grid>
              </Grid>
              <IconFormAutocomplete
                label="Categorías"
                name="categorias"
                control={controlTarea}
                errors={errorsTarea}
                options={todasCategorias}
                icon={<CategoryIcon />}
                rules={{
                  validate: (value: Categoria[] | any) =>
                    value?.length > 0 || "Debes seleccionar al menos una categoría."
                }}
              />
              <Button variant="outlined" startIcon={<ChecklistIcon />} onClick={() => setPantallaActual("subtareas")}>Gestionar Subtareas</Button>
            </Stack>
          )}

          {pantallaActual === "subtareas" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Buscar Subtarea"
                fullWidth
                value={busquedaSubtarea}
                onChange={(e) => setBusquedaSubtarea(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button startIcon={<AddIcon />} onClick={() => { setPantallaActual("nuevaSubtarea"); resetSubtarea(); }}>Nueva Subtarea</Button>
              <List
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                }}
              >
                {filteredSubtareas.length > 0 ? (
                  filteredSubtareas.map((sub, index) => (
                    <ListItem key={sub.id}>
                      <ListItemText primary={sub.titulo || `Subtarea ${index + 1}`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="move-up" onClick={() => moverSubtarea(sub.id, 'up')} disabled={index === 0}>
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="move-down" onClick={() => moverSubtarea(sub.id, 'down')} disabled={index === filteredSubtareas.length - 1}>
                          <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="edit" onClick={() => iniciarEdicionSubtarea(sub)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => setConfirmDialog({
                            open: true,
                            mensaje: `¿Eliminar subtarea '${sub.titulo}'?`,
                            onConfirm: () => eliminarSubtarea(sub.id)
                          })}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                    No hay subtareas para mostrar.
                  </Typography>
                )}
              </List>
            </Stack>
          )}

          {pantallaActual === "nuevaSubtarea" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <IconFormTextField
                label="Título"
                name="titulo"
                control={controlSubtarea}
                rules={{ required: "El título es requerido." }}
                errors={errorsSubtarea}
                icon={<TitleIcon />}
              />
              <IconFormTextField
                label="Contenido"
                name="contenido"
                control={controlSubtarea}
                rules={{}}
                errors={errorsSubtarea}
                multiline
                rows={4}
                icon={<DescriptionIcon />}
              />
              <Grid container>
                <Grid item xs={6} sx={{ pr: 1 }}>
                  <IconFormSelect
                    label="Estado"
                    name="estado"
                    control={controlSubtarea}
                    rules={{ required: "El estado es requerido." }}
                    errors={errorsSubtarea}
                    options={todosEstados}
                    icon={<AssignmentTurnedInIcon />}
                  />
                </Grid>
                <Grid item xs={6} sx={{ pl: 1 }}>
                  <IconFormSelect
                    label="Prioridad"
                    name="prioridad"
                    control={controlSubtarea}
                    rules={{ required: "La prioridad es requerida." }}
                    errors={errorsSubtarea}
                    options={todasPrioridades}
                    icon={<PriorityHighIcon />}
                  />
                </Grid>
              </Grid>
              <IconFormAutocomplete
                label="Categorías"
                name="categorias"
                control={controlSubtarea}
                errors={errorsSubtarea}
                options={todasCategorias}
                icon={<CategoryIcon />}
                rules={{
                  validate: (value: Categoria[] | any) =>
                    value?.length > 0 || "Debes seleccionar al menos una categoría."
                }}
              />
              <Button variant="contained" onClick={handleSubmitSubtarea(agregarSubtareaSubmit)}>Agregar Subtarea</Button>
            </Stack>
          )}

          {pantallaActual === "editarSubtarea" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <IconFormTextField
                label="Título"
                name="titulo"
                control={controlSubtarea}
                rules={{ required: "El título es requerido." }}
                errors={errorsSubtarea}
                icon={<TitleIcon />}
              />
              <IconFormTextField
                label="Contenido"
                name="contenido"
                control={controlSubtarea}
                rules={{}}
                errors={errorsSubtarea}
                multiline
                rows={4}
                icon={<DescriptionIcon />}
              />
              <Grid container>
                <Grid item xs={6} sx={{ pr: 1 }}>
                  <IconFormSelect
                    label="Estado"
                    name="estado"
                    control={controlSubtarea}
                    rules={{ required: "El estado es requerido." }}
                    errors={errorsSubtarea}
                    options={todosEstados}
                    icon={<AssignmentTurnedInIcon />}
                  />
                </Grid>
                <Grid item xs={6} sx={{ pl: 1 }}>
                  <IconFormSelect
                    label="Prioridad"
                    name="prioridad"
                    control={controlSubtarea}
                    rules={{ required: "La prioridad es requerida." }}
                    errors={errorsSubtarea}
                    options={todasPrioridades}
                    icon={<PriorityHighIcon />}
                  />
                </Grid>
              </Grid>
              <IconFormAutocomplete
                label="Categorías"
                name="categorias"
                control={controlSubtarea}
                errors={errorsSubtarea}
                options={todasCategorias}
                icon={<CategoryIcon />}
                rules={{
                  validate: (value: Categoria[] | any) =>
                    value?.length > 0 || "Debes seleccionar al menos una categoría."
                }}
              />
              <Button variant="contained" onClick={handleSubmitSubtarea(guardarEdicionSubtareaSubmit)}>Guardar Cambios</Button>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          {pantallaActual === "formulario" && (
            <>
              <Button onClick={onClose} color="inherit">Cancelar</Button>
              <Button variant="contained" onClick={handleSubmitTarea(guardarTareaSubmit)}>
                {initialTask ? "Guardar Cambios" : "Guardar Tarea"}
              </Button>
            </>
          )}
          {pantallaActual !== "formulario" && (
            <Button onClick={() => setPantallaActual("formulario")} color="inherit">Volver</Button>
          )}
        </DialogActions>

        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmar Acción</DialogTitle>
          <DialogContent>
            <Typography id="alert-dialog-description">
              {confirmDialog.mensaje}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => { confirmDialog.onConfirm(); }} color="error" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </>
  );
}
