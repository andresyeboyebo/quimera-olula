import { ClausulaFiltro, ProcesarContexto } from "@olula/lib/diseño.ts";
import { mensajeTareasTerminadas } from "../dominio.ts";
import { getTareasCosido, patchRecibirCosido } from "../infraestructura.ts";
import {
    ContextoMaestroRecepcionCosido,
    EstadoMaestroRecepcionCosido,
} from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<
    EstadoMaestroRecepcionCosido,
    ContextoMaestroRecepcionCosido
>;

export const recargarTareas: ProcesarMaestro = async (contexto) => {
    const { datos, total } = await getTareasCosido(contexto.filtro);
    return { ...contexto, tareas: datos, total };
};

export const recibirCosido: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    await patchRecibirCosido(id);
    return { ...contexto, mensaje: mensajeTareasTerminadas(id) };
};

export const cambiarFiltro: ProcesarMaestro = async (contexto, payload) => {
    return { ...contexto, filtro: payload as ClausulaFiltro[], mensaje: "" };
};
