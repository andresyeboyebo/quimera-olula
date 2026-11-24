import { describe, expect, test } from "vitest";
import { metaFiltroRecepcionCosido as meta } from "./filtros.tsx";

describe("recepcion_cosido filtros", () => {
    test("estado y albaranado: Todas/Todos no generan cláusula", () => {
        expect(meta.estado.filtro("")).toBeNull();
        expect(meta.estado.filtro("recibida")).toEqual(["estado", "=", "recibida"]);
        expect(meta.albaranado.filtro("")).toBeNull();
        expect(meta.albaranado.filtro("false")).toEqual(["albaranado", "=", "false"]);
        expect(meta.albaranado.describir?.("true")).toBe("Sí");
    });
    test("cosedor", () => {
        expect(meta.cosedor_id.filtro("")).toBeNull();
        expect(meta.cosedor_id.filtro("C1")).toEqual(["cosedor_id", "=", "C1"]);
    });
    test("fecha de cosido: rango manual y atajo", () => {
        expect(
            meta.fecha_cosido.filtro([new Date(2026, 10, 1), new Date(2026, 10, 7)])
        ).toEqual(["fecha_cosido", "<>", "2026-11-01_2026-11-07"]);
        const clausula = meta.fecha_cosido.filtro("@hoy");
        expect(clausula?.[1]).toBe("<>");
        expect(meta.fecha_cosido.filtro("")).toBeNull();
    });
});
