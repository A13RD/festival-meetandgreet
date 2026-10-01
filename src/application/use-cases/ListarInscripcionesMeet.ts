import { AppError } from "../AppError.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class ListarInscripcionesMeet {
  constructor(
    private readonly repository: InscripcionMeetRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    showId?: number,
    asistenteId?: number
  ) {
    if (!Number.isInteger(page) || page <= 0) {
      throw new AppError(400, "page debe ser un entero positivo");
    }

    if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
      throw new AppError(
        400,
        "limit debe ser un entero entre 1 y 50"
      );
    }

    const result = await this.repository.listar(
      page,
      limit,
      showId,
      asistenteId
    );

    return {
      pagination: {
        total: result.total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
      data: result.data,
    };
  }
}