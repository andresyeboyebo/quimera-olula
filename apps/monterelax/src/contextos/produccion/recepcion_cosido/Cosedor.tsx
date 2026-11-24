import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { getCosedores } from "./infraestructura.ts";

interface CosedorProps {
    descripcion?: string;
    valor: string;
    nombre?: string;
    label?: string;
    onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Cosedor = ({
    descripcion = "",
    valor,
    nombre = "cosedor_id",
    label = "Cosedor",
    onChange,
    ...props
}: CosedorProps) => {
    const obtenerOpciones = async (texto: string, id?: string) => {
        const cosedores = await getCosedores(texto, id);
        return cosedores.map((c) => ({ valor: c.id, descripcion: c.nombre }));
    };

    return (
        <QAutocompletar
            label={label}
            nombre={nombre}
            onChange={onChange}
            valor={valor}
            autoSeleccion
            obtenerOpciones={obtenerOpciones}
            descripcion={descripcion}
            longitudMinima={0}
            {...props}
        />
    );
};
