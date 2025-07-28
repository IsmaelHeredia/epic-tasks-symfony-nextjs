"use client";

import React, { useState } from "react";

import LayoutLogin from "@/components/LayoutLogin";
import { FormTextField } from "@/components/CustomTextFields";

import {
    TextField,
    Card,
    CardActions,
    CardContent,
    Typography,
    InputAdornment,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ValidarIngreso } from "@/types/app/login";
import { useForm, SubmitHandler } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useAuthService } from "@/services/authService";

import { useSession } from "next-auth/react";

import { useEffect } from "react";

const Ingreso = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const authService = useAuthService();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    const {
        register: registerIngreso,
        handleSubmit: handleSubmitIngreso,
        formState: { errors: errorsIngreso },
    } = useForm<ValidarIngreso>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleClickIngreso: SubmitHandler<ValidarIngreso> = async (data) => {
        setLoading(true);

        try {
            await authService.loginUser(data);

            toast.success("Bienvenido al sistema", {
                autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
            });

            setTimeout(() => {
                router.replace("/dashboard");
            }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT || 1000));
        } catch (error: any) {
            toast.error(error.message || "Error al iniciar sesión", {
                autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST || 2000),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutLogin>
            <div className="ingreso">
                <Card
                    style={{
                        padding: 24,
                        maxWidth: 600,
                        margin: "auto",
                        borderRadius: 3,
                        boxShadow:
                            "0px 3px 5px rgba(0, 0, 0, 0.1), 0px 6px 10px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <form onSubmit={handleSubmitIngreso(handleClickIngreso)} noValidate>
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h4"
                                component="div"
                                align="center"
                                style={{ paddingBottom: 10 }}
                            >
                                Iniciar sesión
                            </Typography>

                            <FormTextField
                                {...registerIngreso("username", { required: true })}
                                label="Usuario"
                                variant="outlined"
                                color="primary"
                                type="text"
                                sx={{ mb: 3 }}
                                fullWidth
                                error={!!errorsIngreso.username}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormTextField
                                {...registerIngreso("password", { required: true })}
                                label="Clave"
                                variant="outlined"
                                color="primary"
                                type="password"
                                fullWidth
                                sx={{ mb: 1 }}
                                error={!!errorsIngreso.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </CardContent>

                        <CardActions className="center-div">
                            <LoadingButton
                                startIcon={<LoginIcon />}
                                loadingPosition="start"
                                variant="contained"
                                color="primary"
                                type="submit"
                                loading={loading}
                                disabled={loading}
                            >
                                Ingresar
                            </LoadingButton>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </LayoutLogin>
    );
};

export default Ingreso;