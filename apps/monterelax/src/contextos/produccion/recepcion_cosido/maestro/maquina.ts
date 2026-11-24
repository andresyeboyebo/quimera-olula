import { Maquina } from "@olula/lib/diseño.ts";
import {
    ContextoMaestroRecepcionCosido,
    EstadoMaestroRecepcionCosido,
} from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<
    EstadoMaestroRecepcionCosido,
    ContextoMaestroRecepcionCosido
> = () => ({
    INICIAL: {
        recarga_solicitada: maestro.recargarTareas,
        filtro_cambiado: [maestro.cambiarFiltro, maestro.recargarTareas],
        recepcion_solicitada: [maestro.recibirCosido, maestro.recargarTareas],
    },
});
