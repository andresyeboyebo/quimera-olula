import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { TareaCosido } from "../diseño.ts";

import { filtroRecepcionCosidoInicial } from "../dominio.ts";

export type EstadoMaestroRecepcionCosido = "INICIAL";

export type ContextoMaestroRecepcionCosido = {
    estado: EstadoMaestroRecepcionCosido;
    tareas: TareaCosido[];
    total: number;
    filtro: ClausulaFiltro[];
    mensaje: string;
};

export const contextoInicialRecepcionCosido: ContextoMaestroRecepcionCosido = {
    estado: "INICIAL",
    tareas: [],
    total: 0,
    filtro: filtroRecepcionCosidoInicial,
    mensaje: "",
};
