import { AppError } from "../AppError.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class ObtenerInscripcionesPorShow {
  constructor(
    private readonly repository: InscripcionMeetRepository
  ) {}

  async execute(showId: number) {
    if (!Number.isInteger(showId) || showId <= 0) {
      throw new AppError(
        400,
        "showId debe ser un entero positivo"
      );
    }

    const show =
      await this.repository.obtenerShow(showId);

    if (!show) {
      throw new AppError(404, "Show no encontrado");
    }

    const inscritos =
      await this.repository.obtenerInscripcionesActivasPorShow(
        showId
      );

    const cupo = 3;
    const ocupados = inscritos.length;
    const disponibles = cupo - ocupados;

    return {
      show_id: showId,
      cupo,
      ocupados,
      disponibles,
      inscritos: inscritos.map((item) => ({
        asistente_id: item.asistente_id,
        nombre: item.asistentes.nombre,
      })),
    };
  }
}