import { AppError } from "../AppError.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class ActualizarInscripcionMeet {
  constructor(
    private readonly repository: InscripcionMeetRepository
  ) {}

  async execute(id: number, body: Record<string, unknown>) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "El id debe ser un entero positivo");
    }

    const inscription =
      await this.repository.obtenerPorId(id);

    if (!inscription) {
      throw new AppError(404, "Inscripción no encontrada");
    }

    const fields = Object.keys(body);

    for (const field of fields) {
      if (field !== "show_id") {
        throw new AppError(
          400,
          `El campo ${field} no se puede modificar`
        );
      }
    }

    if (
      !Object.prototype.hasOwnProperty.call(body, "show_id") ||
      !Number.isInteger(body.show_id)
    ) {
      throw new AppError(
        400,
        "show_id debe ser un entero"
      );
    }

    const newShowId = body.show_id as number;

    const show =
      await this.repository.obtenerShow(newShowId);

    if (!show) {
      throw new AppError(404, "Show no encontrado");
    }

    const tieneBoleta =
      await this.repository.tieneBoletaVipOPlatino(
        inscription.asistente_id,
        show.dia_id
      );

    if (!tieneBoleta) {
      throw new AppError(
        409,
        "El asistente necesita una boleta activa VIP o PLATINO para el día del show"
      );
    }

    const yaExiste =
      await this.repository.existeInscripcionActiva(
        inscription.asistente_id,
        newShowId,
        id
      );

    if (yaExiste) {
      throw new AppError(
        409,
        "El asistente ya está inscrito en este show"
      );
    }

    const ocupados =
      await this.repository.contarInscripcionesActivas(
        newShowId
      );

    if (ocupados >= 3) {
      throw new AppError(
        409,
        "El show ya tiene el máximo de 3 inscritos"
      );
    }

    return this.repository.actualizarShow(
      id,
      newShowId
    );
  }
}