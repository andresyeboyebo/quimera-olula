import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Criteria } from "@olula/lib/diseño.ts";
import { LIMITE_TAREAS_COSIDO } from "./dominio.ts";
import {
    Cosedor,
    EstadoTareaCosido,
    GetCosedores,
    GetTareasCosido,
    PatchRecibirCosido,
    TareaCosido,
} from "./diseño.ts";

const urlRecepcionCosido = "/produccion/recepcion_cosido";
const urlCosedor = "/produccion/cosedor";
const urlUnidadProducto = "/produccion/unidad_producto";

interface TareaCosidoApi {
    id: string;
    modelo: string;
    tela_id: string;
    cosedor_id: string;
    cosedor: string;
    fecha_salida: string | null;
    cosido: boolean;
    fecha_cosido: string | null;
    albaranado: boolean;
    estado: EstadoTareaCosido;
}

interface CosedorApi {
    id: string;
    nombre: string;
}

export const tareaCosidoDesdeApi = (t: TareaCosidoApi): TareaCosido => ({
    id: t.id,
    modelo: t.modelo,
    telaId: t.tela_id,
    cosedorId: t.cosedor_id,
    cosedor: t.cosedor,
    fechaSalida: t.fecha_salida,
    cosido: t.cosido,
    fechaCosido: t.fecha_cosido,
    albaranado: t.albaranado,
    estado: t.estado,
});

export const cosedorDesdeApi = (c: CosedorApi): Cosedor => ({
    id: c.id,
    nombre: c.nombre,
});

/** El servidor aplica el filtro fijo de tareas de cosido y el orden. */
export const getTareasCosido: GetTareasCosido = async (filtro) => {
    const criteria: Criteria = {
        filtro,
        orden: [],
        paginacion: { pagina: 1, limite: LIMITE_TAREAS_COSIDO },
    };
    return RestAPI.getQuery<TareaCosido, TareaCosidoApi>(
        urlRecepcionCosido,
        criteria,
        tareaCosidoDesdeApi
    );
};

export const getCosedores: GetCosedores = async (texto, id) => {
    const criteria: Criteria = {
        filtro: id ? [["id", "=", id]] : [["nombre", "~", texto]],
        orden: ["nombre"],
        paginacion: { pagina: 1, limite: 50 },
    };
    const respuesta = await RestAPI.getQuery<Cosedor, CosedorApi>(
        urlCosedor,
        criteria,
        cosedorDesdeApi
    );
    return respuesta.datos;
};

export const patchRecibirCosido: PatchRecibirCosido = async (id) => {
    await RestAPI.patch(
        `${urlUnidadProducto}/${id}/recibir_cosido`,
        {},
        "Error al recibir el cosido"
    );
};
