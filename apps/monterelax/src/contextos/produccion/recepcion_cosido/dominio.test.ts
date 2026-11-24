import { describe, expect, test } from "vitest";
import { TareaCosido } from "./diseño.ts";
import {
    filtroRecepcionCosidoInicial,
    rangoAtajoFecha,
    claveTareaCosido,
    puedeRecibirse,
    textoFechaCosido,
    formatearFechaSalida,
    mensajeTareasTerminadas,
    textoContadorTareas,
    textoCosedorFecha,
    textoModeloTela,
} from "./dominio.ts";

const tarea: TareaCosido = {
    id: "UP001",
    modelo: "M1",
    telaId: "T9",
    cosedorId: "C1",
    cosedor: "Ana",
    fechaSalida: "2024-01-15",
    cosido: false,
    fechaCosido: null,
    albaranado: false,
    estado: "pendiente",
};

describe("recepcion_cosido dominio", () => {
    test("formatearFechaSalida", () => {
        expect(formatearFechaSalida("2024-01-15")).toBe("15/01/2024");
        expect(formatearFechaSalida(null)).toBe("");
    });
    test("textos", () => {
        expect(textoModeloTela(tarea)).toBe("MODELO M1 - TELA T9");
        expect(textoCosedorFecha(tarea)).toBe("Cosedor Ana - 15/01/2024");
        expect(textoContadorTareas(3, 3)).toBe("Unidades mostradas: 3");
        expect(textoContadorTareas(3, 10)).toBe("Unidades mostradas: 3 de 10");
        expect(mensajeTareasTerminadas("UP001")).toBe(
            "Tareas de unidad UP001 terminadas correctamente"
        );
    });

    test("filtro por defecto: solo pendientes", () => {
        expect(filtroRecepcionCosidoInicial).toEqual([["estado", "=", "pendiente"]]);
    });
    test("atajos de fecha a rango", () => {
        // miércoles 18/11/2026
        const hoy = new Date(2026, 10, 18);
        expect(rangoAtajoFecha("@hoy", hoy)).toEqual(["2026-11-18", "2026-11-18"]);
        expect(rangoAtajoFecha("@ayer", hoy)).toEqual(["2026-11-17", "2026-11-17"]);
        expect(rangoAtajoFecha("@esta-semana", hoy)).toEqual(["2026-11-16", "2026-11-22"]);
        expect(rangoAtajoFecha("@semana-anterior", hoy)).toEqual(["2026-11-09", "2026-11-15"]);
        expect(rangoAtajoFecha("@este-mes", hoy)).toEqual(["2026-11-01", "2026-11-30"]);
        expect(rangoAtajoFecha("@mes-anterior", hoy)).toEqual(["2026-10-01", "2026-10-31"]);
        expect(rangoAtajoFecha("@este-año", hoy)).toEqual(["2026-01-01", "2026-12-31"]);
        expect(rangoAtajoFecha("@desconocido", hoy)).toBeNull();
    });
    test("atajo de semana en domingo", () => {
        expect(rangoAtajoFecha("@esta-semana", new Date(2026, 10, 22))).toEqual([
            "2026-11-16",
            "2026-11-22",
        ]);
    });
    test("derivados de fila", () => {
        expect(puedeRecibirse(tarea)).toBe(true);
        expect(puedeRecibirse({ ...tarea, estado: "recibida" })).toBe(false);
        expect(claveTareaCosido(tarea)).toBe("UP001-C1");
        expect(textoFechaCosido({ ...tarea, fechaCosido: "2024-02-03" })).toBe("Cosido 03/02/2024");
        expect(textoFechaCosido(tarea)).toBe("");
    });
});
