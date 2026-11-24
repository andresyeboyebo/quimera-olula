import { ClausulaFiltro, Entidad } from "@olula/lib/diseño.ts";

/** Tarea de cosido en curso de una unidad de producto. El id es el de la unidad. */
export interface TareaCosido extends Entidad {
    id: string;
    modelo: string;
    telaId: string;
    cosedorId: string;
    cosedor: string;
    /** Fecha ISO "YYYY-MM-DD" o null si aún no ha salido. */
    fechaSalida: string | null;
    cosido: boolean;
    /** Fecha ISO "YYYY-MM-DD" o null si aún no está cosida/recibida. */
    fechaCosido: string | null;
    albaranado: boolean;
    estado: EstadoTareaCosido;
}

export type EstadoTareaCosido = "pendiente" | "recibida";

export interface Cosedor {
    id: string;
    nombre: string;
}

export type GetTareasCosido = (
    filtro: ClausulaFiltro[]
) => Promise<{ datos: TareaCosido[]; total: number }>;
export type GetCosedores = (texto: string, id?: string) => Promise<Cosedor[]>;
export type PatchRecibirCosido = (id: string) => Promise<void>;
