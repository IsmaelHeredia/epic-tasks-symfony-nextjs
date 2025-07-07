import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { fetchEstadisticas } from '@/services/estadisticasService';
import { CategoriaReporte } from '@/types/api';

interface ReporteCategoriasModalProps {
    open: boolean;
    onClose: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF00AA'];

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};

const chartContainerStyle = {
    width: '100%',
    height: 300,
    minHeight: 300,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const ReporteCategoriasModal: React.FC<ReporteCategoriasModalProps> = ({ open, onClose }) => {
    const [data, setData] = useState<CategoriaReporte[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            setError(null);
            fetchEstadisticas()
                .then(response => {
                    if (response && response.estadisticas) {
                        setData(response.estadisticas);
                    } else {
                        setData(response as unknown as CategoriaReporte[]);
                    }
                })
                .catch(err => {
                    console.error("No se pudieron cargar las estadísticas:", err);
                    setError("No se pudieron cargar las estadísticas. Inténtalo de nuevo más tarde.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open]);

    const renderTooltipContent = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];

            return (
                <Box sx={{ bgcolor: 'white', border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{name}</Typography>
                    <Typography variant="body2">{`Tareas: ${value}`}</Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="reporte-categorias-modal-title"
            aria-describedby="reporte-categorias-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    id="statistics-modal-title"
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mt: 3,
                        textAlign: 'center'
                    }}
                >
                    Estadísticas del Programa
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                )}

                {!loading && !error && data.length === 0 && (
                    <Alert severity="info" sx={{ my: 2 }}>No hay datos para mostrar en el reporte.</Alert>
                )}

                {!loading && !error && data.length > 0 ? (
                    <Box sx={chartContainerStyle}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="totalTareas"
                                    nameKey="nombreCategoria"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    labelLine={false}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={renderTooltipContent} />
                                <Legend wrapperStyle={{ paddingTop: '30px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                ) : null
                }
            </Box>
        </Modal>
    );
};

export default ReporteCategoriasModal;