import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import {
    filtroFechas,
    MetaFiltro,
} from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.tsx";
import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { Cosedor } from "../Cosedor.tsx";
import { rangoAtajoFecha } from "../dominio.ts";

type OpcionFiltro = { valor: string; descripcion: string };

const opcionesEstado: OpcionFiltro[] = [
    { valor: "pendiente", descripcion: "Pendientes" },
    { valor: "recibida", descripcion: "Recibidas" },
    { valor: "", descripcion: "Todas" },
];

const opcionesAlbaranado: OpcionFiltro[] = [
    { valor: "", descripcion: "Todos" },
    { valor: "true", descripcion: "Sí" },
    { valor: "false", descripcion: "No" },
];

const describirOpcion = (opciones: OpcionFiltro[]) => (valor: unknown) =>
    opciones.find((o) => o.valor === String(valor))?.descripcion ?? String(valor);

/** Nombres de cosedor elegidos en el panel, para el texto del chip (el filtro solo guarda el id). */
const nombresCosedor = new Map<string, string>();

const filtroFechaCosido = (valor: unknown): ClausulaFiltro | null => {
    // la opción vacía del selector de intervalos llega como "" (filtroFechas generaría "= ''")
    if (valor === "") return null;
    if (typeof valor === "string" && valor.startsWith("@")) {
        const rango = rangoAtajoFecha(valor);
        return rango ? ["fecha_cosido", "<>", rango.join("_")] : null;
    }
    return filtroFechas("fecha_cosido", valor);
};

/**
 * Los campos con `render` no declaran `tipo`, para que el valor llegue intacto
 * al selector (igual que los filtros de entidad de ventas/comun/filtros.tsx).
 */
export const metaFiltroRecepcionCosido: MetaFiltro = {
    fecha_cosido: {
        id: "fecha_cosido",
        label: "Fecha de cosido",
        tipo: "intervalo_fechas",
        filtro: filtroFechaCosido,
    },
    estado: {
        id: "estado",
        label: "Estado",
        filtro: (v) => (v ? ["estado", "=", v as string] : null),
        describir: describirOpcion(opcionesEstado),
        render: (valor, onChange) => (
            <QSelect
                label="Estado"
                nombre="estado"
                valor={(valor as string) ?? ""}
                opciones={opcionesEstado}
                onChange={(o) => onChange(o?.valor ?? "")}
            />
        ),
    },
    cosedor_id: {
        id: "cosedor_id",
        label: "Cosedor",
        filtro: (v) => (v ? ["cosedor_id", "=", v as string] : null),
        describir: (v) => nombresCosedor.get(String(v)) ?? String(v),
        render: (valor, onChange) => (
            <Cosedor
                valor={(valor as string) ?? ""}
                descripcion={nombresCosedor.get(String(valor ?? "")) ?? ""}
                onChange={(opcion) => {
                    if (opcion) nombresCosedor.set(opcion.valor, opcion.descripcion);
                    onChange(opcion?.valor ?? "");
                }}
            />
        ),
    },
    albaranado: {
        id: "albaranado",
        label: "Albaranado",
        filtro: (v) => (v ? ["albaranado", "=", v as string] : null),
        describir: describirOpcion(opcionesAlbaranado),
        render: (valor, onChange) => (
            <QSelect
                label="Albaranado"
                nombre="albaranado"
                valor={(valor as string) ?? ""}
                opciones={opcionesAlbaranado}
                onChange={(o) => onChange(o?.valor ?? "")}
            />
        ),
    },
};
