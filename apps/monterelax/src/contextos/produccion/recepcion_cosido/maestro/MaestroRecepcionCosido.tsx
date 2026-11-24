import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QAvatar } from "@olula/componentes/atomos/qavatar.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MaestroFiltrosActivoControlado } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.tsx";
import { useEffect } from "react";
import {
    claveTareaCosido,
    filtroRecepcionCosidoInicial,
    puedeRecibirse,
    textoContadorTareas,
    textoCosedorFecha,
    textoFechaCosido,
    textoModeloTela,
} from "../dominio.ts";
import { TareaCosido } from "../diseño.ts";
import { contextoInicialRecepcionCosido } from "./diseño.ts";
import { metaFiltroRecepcionCosido } from "./filtros.tsx";
import "./MaestroRecepcionCosido.css";
import { getMaquina } from "./maquina.ts";

export const MaestroRecepcionCosido = () => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoInicialRecepcionCosido);

    useEffect(() => {
        emitir("recarga_solicitada");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="RecepcionCosido">
            <h2>Recepción de Cosido</h2>
            <div className="recepcion-cosido-cabecera">
                <MaestroFiltrosActivoControlado
                    metaFiltro={metaFiltroRecepcionCosido}
                    filtroInicial={filtroRecepcionCosidoInicial}
                    filtro={ctx.filtro}
                    onFiltroChanged={(filtro) => emitir("filtro_cambiado", filtro)}
                />
                <div className="recepcion-cosido-contador">
                    {textoContadorTareas(ctx.tareas.length, ctx.total)}
                </div>
            </div>
            {ctx.mensaje && <QAviso variante="info">{ctx.mensaje}</QAviso>}
            <div className="recepcion-cosido-lista">
                {ctx.tareas.map((tarea) => (
                    <FilaTareaCosido
                        key={claveTareaCosido(tarea)}
                        tarea={tarea}
                        onRecibir={() => emitir("recepcion_solicitada", tarea.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const FilaTareaCosido = ({
    tarea,
    onRecibir,
}: {
    tarea: TareaCosido;
    onRecibir: () => void;
}) => (
    <div className="recepcion-cosido-fila">
        {/* hueco reservado para un futuro checkbox de multiselección */}
        <QAvatar
            className={`recepcion-cosido-avatar ${tarea.cosido ? "cosido" : ""}`}
            tamaño="sm"
        >
            <QIcono nombre="tarea" tamaño="sm" />
        </QAvatar>
        <div className="recepcion-cosido-texto">
            <div>
                <strong>{tarea.id}</strong>
            </div>
            <div>
                <strong>{textoModeloTela(tarea)}</strong>
            </div>
            <div>{textoCosedorFecha(tarea)}</div>
            {tarea.fechaCosido && <div>{textoFechaCosido(tarea)}</div>}
            <div className="recepcion-cosido-indicadores">
                {tarea.estado === "recibida" && <QEtiqueta>Recibida</QEtiqueta>}
                {tarea.albaranado && <QEtiqueta>Albaranado</QEtiqueta>}
            </div>
        </div>
        {puedeRecibirse(tarea) && (
            <QBoton variante="texto" tamaño="pequeño" onClick={onRecibir}>
                <QIcono nombre="check" tamaño="sm" />
            </QBoton>
        )}
    </div>
);
