import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { TareaCosido } from "./diseño.ts";

/** Máximo de tareas pedidas al servidor (el legacy no paginaba). */
export const LIMITE_TAREAS_COSIDO = 1000;

/** "2024-01-15" -> "15/01/2024". Vacío si no hay fecha. No usa Date para evitar desfases de zona horaria. */
export const formatearFechaSalida = (fecha: string | null): string => {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.slice(0, 10).split("-");
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
};

export const textoModeloTela = (t: TareaCosido): string =>
    `MODELO ${t.modelo} - TELA ${t.telaId}`;

export const textoCosedorFecha = (t: TareaCosido): string =>
    `Cosedor ${t.cosedor} - ${formatearFechaSalida(t.fechaSalida)}`;

/** La pantalla abre con las unidades pendientes de recibir. */
export const filtroRecepcionCosidoInicial: ClausulaFiltro[] = [["estado", "=", "pendiente"]];

const isoLocal = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const desplazarDias = (d: Date, dias: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + dias);

/**
 * Rango [desde, hasta] ("YYYY-MM-DD") de un atajo de QDateInterval ("@esta-semana"…).
 * El servidor no interpreta los atajos, así que se resuelven aquí. Semanas de lunes a domingo.
 */
export const rangoAtajoFecha = (atajo: string, hoy: Date = new Date()): [string, string] | null => {
    const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const dia = (n: number): [string, string] => {
        const d = isoLocal(desplazarDias(base, n));
        return [d, d];
    };
    const semana = (n: number): [string, string] => {
        const lunes = desplazarDias(base, -((base.getDay() + 6) % 7) + 7 * n);
        return [isoLocal(lunes), isoLocal(desplazarDias(lunes, 6))];
    };
    const mes = (n: number): [string, string] => [
        isoLocal(new Date(base.getFullYear(), base.getMonth() + n, 1)),
        isoLocal(new Date(base.getFullYear(), base.getMonth() + n + 1, 0)),
    ];
    const anyo = (n: number): [string, string] => [
        `${base.getFullYear() + n}-01-01`,
        `${base.getFullYear() + n}-12-31`,
    ];
    const rangos: Record<string, () => [string, string]> = {
        "@hoy": () => dia(0),
        "@ayer": () => dia(-1),
        "@mañana": () => dia(1),
        "@esta-semana": () => semana(0),
        "@semana-anterior": () => semana(-1),
        "@semana-siguiente": () => semana(1),
        "@este-mes": () => mes(0),
        "@mes-anterior": () => mes(-1),
        "@mes-siguiente": () => mes(1),
        "@este-año": () => anyo(0),
        "@año-anterior": () => anyo(-1),
        "@año-siguiente": () => anyo(1),
    };
    return rangos[atajo]?.() ?? null;
};

export const textoFechaCosido = (t: TareaCosido): string =>
    t.fechaCosido ? `Cosido ${formatearFechaSalida(t.fechaCosido)}` : "";

export const puedeRecibirse = (t: TareaCosido): boolean => t.estado === "pendiente";

export const claveTareaCosido = (t: TareaCosido): string => `${t.id}-${t.cosedorId}`;

export const textoContadorTareas = (mostradas: number, total: number): string =>
    total > mostradas
        ? `Unidades mostradas: ${mostradas} de ${total}`
        : `Unidades mostradas: ${mostradas}`;

export const mensajeTareasTerminadas = (id: string): string =>
    `Tareas de unidad ${id} terminadas correctamente`;
