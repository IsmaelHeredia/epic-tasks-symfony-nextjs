import { CuentaPayload, AccountUpdateResponse } from "@/types/api";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function actualizarCuenta(data: CuentaPayload): Promise<AccountUpdateResponse> {
  const session = await getSession();
  const token = session?.accessToken;

  const formData = new FormData();
  if (data.nombre !== undefined) {
    formData.append("nombre", data.nombre);
  }
  if (data.clave !== undefined && data.clave !== null) {
    formData.append("clave", data.clave);
  }
  if (data.imagen !== undefined) {
    if (data.imagen === null) {
      formData.append("imagen", "null");
    } else {
      formData.append("imagen", data.imagen);
    }
  }

  if (data.currentPassword !== undefined && data.currentPassword !== null) {
    formData.append("currentPassword", data.currentPassword);
  }

  const res = await fetch(`${BASE_URL}/api/usuario/actualizar-cuenta`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ mensaje: 'Error desconocido al actualizar la cuenta' }));
    throw new Error(errorBody.mensaje || "Error al actualizar la cuenta");
  }

  return res.json();
}