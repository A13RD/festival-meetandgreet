export interface InscripcionMeetRepository {
  listar(
    page: number,
    limit: number,
    showId?: number,
    asistenteId?: number
  ): Promise<{
    data: any[];
    total: number;
  }>;

  obtenerPorId(id: number): Promise<any | null>;

  crear(asistenteId: number, showId: number): Promise<any>;

  actualizarShow(id: number, showId: number): Promise<any>;

  eliminar(id: number): Promise<any>;

  existeAsistente(id: number): Promise<boolean>;

  obtenerShow(id: number): Promise<any | null>;

  tieneBoletaVipOPlatino(asistenteId: number, diaId: number): Promise<boolean>;

  existeInscripcionActiva(
    asistenteId: number,
    showId: number,
    excluirId?: number
  ): Promise<boolean>;

  contarInscripcionesActivas(showId: number): Promise<number>;

  obtenerInscripcionesActivasPorShow(showId: number): Promise<any[]>;
}