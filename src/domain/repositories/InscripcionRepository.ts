export interface InscripcionRepository {
    listar(page: number,
        limit: number,
        showId?: number,
        asistenteId?: number
    ): Promise<{
        data: any[],
        total: number
    }>;
    
    crear(asistenteId: number, showId: number): Promise<any>;

    obtenerId(id: number): Promise<any | null>;

    obtenerShow(id: number): Promise<any | null>;
    
    actualizarShow(id: number, showId: number): Promise<any>;

    eliminar(id: number): Promise<any>;

    existeAsistente(id: number): Promise<boolean>;

    boletaVipOPlatino(asistenteId: number, diaId: number): Promise<boolean>;

    existeInscripcion(asistenteId: number, showId: number, excluirId?: number): Promise<boolean>;

    contarInscripcionesPorAsistente(showId: number): Promise<number>;

    obtenerInscripcionesPorShow(showId: number): Promise<any[]>;
    
}