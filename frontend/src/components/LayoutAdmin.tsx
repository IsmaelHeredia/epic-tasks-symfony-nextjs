import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "@/styles/global.css";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CategoryIcon from "@mui/icons-material/Category";
import NoteIcon from "@mui/icons-material/Note";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from "@mui/icons-material/Search";
import LabelIcon from "@mui/icons-material/Label";
import ClearIcon from "@mui/icons-material/Clear";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter, usePathname } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/redux/global";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { changeMode, selectTheme } from "@/store/reducers/themesSlice";
import { setSearchCategorias, setSearchTitulo, triggerSearch } from "@/store/reducers/searchFiltersSlice";

import { Autocomplete, Chip, Drawer, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField, Box, Divider } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SearchCategoryAutocomplete, SearchNameTextField } from "@/components/CustomTextFields";

import { Categoria } from "@/types/Categoria";
import { fetchCategorias } from "@/services/categoriaService";
import ProfileSettingsModal from "@/components/ProfileSettingsModal";

const drawerWidth = 240;

interface SearchFormInputs {
    searchTitulo: string;
    searchCategorias: Categoria[];
}

export default function LayoutAdmin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();

    const mode = useSelector((state: RootState) => state.themes.mode);
    const theme = useSelector(selectTheme);

    const searchFilters = useSelector((state: RootState) => state.searchFilters) || { titulo: '', categoriaIds: [] };
    const { titulo, categoriaIds } = searchFilters;

    const [categories, setCategories] = useState<Categoria[]>([]);

    const selectedCategoriesObjects: Categoria[] = React.useMemo(() => {
        return categories.filter(cat => categoriaIds.includes(cat.id));
    }, [categories, categoriaIds]);

    const { control, handleSubmit, setValue } = useForm<SearchFormInputs>({
        defaultValues: {
            searchTitulo: titulo,
            searchCategorias: selectedCategoriesObjects,
        },
    });

    useEffect(() => {
        setValue('searchTitulo', titulo, { shouldDirty: false, shouldValidate: false });
        setValue('searchCategorias', selectedCategoriesObjects, { shouldDirty: false, shouldValidate: false });
    }, [titulo, selectedCategoriesObjects, setValue]);

    const handleClickLogOut = async () => {
        toast.success("La sesión fue cerrada", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000) });
        setTimeout(() => {
            signOut({ callbackUrl: "/" });
        }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT || 500));
    }

    const [open, setOpen] = useState(false);
    const toggleDrawer = () => setOpen(!open);

    const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
        dispatch(setSearchTitulo(data.searchTitulo));
        dispatch(setSearchCategorias(data.searchCategorias.map(cat => cat.id)));
        dispatch(triggerSearch());
    };

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchCategorias()
            .then((response) => {
                setCategories(response.categorias);
            })
            .catch(console.error);
    }, []);

    const getProfileImageUrl = (imageFileName?: string | null): string => {
        if (imageFileName) {
            return `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/uploads/usuarios/${imageFileName}`;
        }
        return '/default-avatar.png';
    };

    return (
        <>
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />

                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: open ? drawerWidth : 60,
                            right: 0,
                            height: 64,
                            backgroundColor: theme.palette.customNavbar?.background,
                            zIndex: theme.zIndex.drawer + 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "left 0.3s",
                        }}
                    >
                        <Toolbar sx={{ justifyContent: "space-between", pr: 0, height: '100%', width: '100%' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={toggleDrawer}
                                    edge="start"
                                    sx={{
                                        mr: 2,
                                        color: theme.palette.customIconNavbar?.background,
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>

                                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <Controller
                                        name="searchTitulo"
                                        control={control}
                                        render={({ field }) => (
                                            <SearchNameTextField
                                                {...field}
                                                placeholder="Nombre..."
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LabelIcon color="action" />
                                                        </InputAdornment>
                                                    ),

                                                    endAdornment: field.value ? (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => {
                                                                    field.onChange('');
                                                                    dispatch(setSearchTitulo(''));
                                                                }}
                                                                edge="end"
                                                                size="small"
                                                                aria-label="clear search input"
                                                                sx={{ color: theme.palette.action.active }}
                                                            >
                                                                <ClearIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ) : null,
                                                }}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="searchCategorias"
                                        control={control}
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <SearchCategoryAutocomplete
                                                {...field}
                                                multiple
                                                options={categories || []}
                                                getOptionLabel={(option) => option.nombre}
                                                isOptionEqualToValue={(option, val) => option.id === val.id}
                                                size="small"
                                                value={value || []}
                                                onChange={(_, newValue) => onChange(newValue)}
                                                renderTags={(tagValue, getTagProps) => {
                                                    return [
                                                        ...tagValue.slice(0, 1).map((option, index) => (
                                                            <Chip
                                                                label={option.nombre}
                                                                {...getTagProps({ index })}
                                                                key={option.id}
                                                                size="small"
                                                            />
                                                        )),
                                                        ...(tagValue.length > 1
                                                            ? [<Chip key={`+${tagValue.length - 1}`} label={`+${tagValue.length - 1}`} size="small" />]
                                                            : []),
                                                    ];
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder={value && value.length === 0 ? "Categorías" : ""}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start" sx={{ marginLeft: '12px', marginRight: '8px' }}>
                                                                        <CategoryIcon color="action" />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />

                                    <IconButton
                                        type="submit"
                                        sx={{ color: "customIconNavbar.background" }}
                                        size="large">
                                        <SearchIcon />
                                    </IconButton>
                                </form>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />


                            <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                                <Tooltip title="Modo claro/oscuro">
                                    <IconButton
                                        onClick={() =>
                                            dispatch(changeMode({ mode: mode === "light" ? "dark" : "light" }))
                                        }
                                        sx={{
                                            color: theme.palette.customIconNavbar?.background,
                                        }}
                                    >
                                        {mode === "light" ? <DarkModeIcon /> : <WbSunnyIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={user?.nombre || "Usuario"}>
                                    <IconButton onClick={handleOpenModal}>
                                        <Avatar sx={{ width: 32, height: 32 }}>
                                            {user?.imagen ? (
                                                <Image
                                                    src={getProfileImageUrl(user.imagen)}
                                                    alt={user?.nombre || "User Avatar"}
                                                    width={32}
                                                    height={32}
                                                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            ) : (
                                                <PersonIcon fontSize="small" sx={{ color: theme.palette.customIconNavbar?.background }} />
                                            )}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Toolbar>
                    </div>

                    <Drawer
                        variant="permanent"
                        sx={{
                            width: open ? drawerWidth : 60,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: open ? drawerWidth : 60,
                                transition: "width 0.3s",
                                overflowX: "hidden",
                                backgroundColor: theme.palette.customNavbar?.background,
                                color: theme.palette.customNavbar?.color,
                                borderRight: "none",
                                borderRadius: "0",
                            },
                        }}
                    >
                        <List sx={{ mt: -1 }} >
                            <ListItem disablePadding sx={{ height: 64, justifyContent: open ? 'flex-start' : 'center' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: open ? 2 : 1,
                                        width: '100%',
                                        justifyContent: open ? 'flex-start' : 'center',
                                        gap: open ? 1 : 0,
                                    }}
                                >
                                    {open && (
                                        <ComputerIcon sx={{ color: theme.palette.customIconNavbar?.background, mr: 1, fontSize: '2rem' }} />
                                    )}
                                    {open && (
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'inherit',
                                                fontSize: '1.5rem',
                                            }}
                                        >
                                            Epic Tasks
                                        </Typography>
                                    )}
                                    {!open && (
                                        <ComputerIcon sx={{ color: theme.palette.customIconNavbar?.background, fontSize: '2rem' }} />
                                    )}
                                </Box>
                            </ListItem>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: open ? 'row' : 'column',
                                    py: 2,
                                    px: open ? 2 : 1,
                                    gap: open ? 1 : 0.5,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    cursor: 'pointer',
                                    justifyContent: open ? 'flex-start' : 'center',
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    }
                                }}
                                onClick={handleOpenModal}
                            >
                                <Avatar
                                    sx={{
                                        width: open ? 48 : 32,
                                        height: open ? 48 : 32,
                                        border: '2px solid',
                                        borderColor: theme.palette.primary.main,
                                        marginLeft: open ? '-5px' : '-10px',
                                    }}
                                >
                                    {user?.imagen ? (
                                        <Image
                                            src={getProfileImageUrl(user.imagen)}
                                            alt={user?.nombre || "User Avatar"}
                                            width={open ? 48 : 32}
                                            height={open ? 48 : 32}
                                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <PersonIcon fontSize={open ? "large" : "small"} sx={{ color: theme.palette.customIconNavbar?.background }} />
                                    )}
                                </Avatar>
                                {open && (
                                    <Typography variant="body1" sx={{ color: theme.palette.customNavbar?.color, fontWeight: 'medium', textAlign: 'center' }}>
                                        {user?.nombre || "Usuario"}
                                    </Typography>
                                )}
                            </Box>

                            {[
                                { url: "/", text: "Inicio", icon: <HomeIcon /> },
                                { url: "/tareas", text: "Tareas", icon: <NoteIcon /> },
                                { url: "/estadisticas", text: "Estadísticas", icon: <BarChartIcon /> },
                                { url: "/informacion", text: "Información", icon: <InfoIcon /> }
                            ].map((item, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        onClick={() => router.push(item.url)}
                                        sx={{
                                            backgroundColor: pathname === item.url ? theme.palette.action.selected : "inherit",
                                            "&:hover": { backgroundColor: theme.palette.action.hover },
                                            px: open ? 2 : 1,
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: theme.palette.customIconNavbar?.background,
                                                minWidth: 0,
                                                mr: open ? 2 : "auto",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {open && (
                                            <ListItemText
                                                primary={item.text}
                                                sx={{
                                                    color: theme.palette.customNavbar?.menuTextColor,
                                                    '& .MuiListItemText-primary': {
                                                        color: theme.palette.customNavbar?.menuTextColor,
                                                    },
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            ))}

                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={handleClickLogOut}
                                    sx={{
                                        backgroundColor: "inherit",
                                        "&:hover": { backgroundColor: theme.palette.action.hover },
                                        px: open ? 2 : 1,
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: theme.palette.customIconNavbar?.background,
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    {open && <ListItemText primary="Salir" sx={{
                                        color: theme.palette.customNavbar?.menuTextColor,
                                        '& .MuiListItemText-primary': {
                                            color: theme.palette.customNavbar?.menuTextColor,
                                        },
                                    }} />}
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>

                    <div
                        style={{
                            marginLeft: open ? drawerWidth : 60,
                            transition: "margin-left 0.3s",
                            padding: "20px",
                        }}
                    >
                        {children}
                    </div>

                    <ProfileSettingsModal
                        open={isModalOpen}
                        onClose={handleCloseModal}
                    />

                    <div style={{ marginTop: "15px" }}>
                        <ToastContainer
                            position="bottom-center"
                            autoClose={Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000)}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme={mode == "light" ? "light" : "dark"}
                        />
                    </div>

                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    );
}