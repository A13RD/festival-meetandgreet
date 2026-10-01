import { prisma } from "../prisma/prisma.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class PrismaInscripcionMeetRepository
  implements InscripcionMeetRepository
{
  async listar(
    page: number,
    limit: number,
    showId?: number,
    asistenteId?: number
  ) {
    const where: any = {
      state: {
        not: "REMOVED",
      },
    };

    if (showId !== undefined) {
      where.show_id = showId;
    }

    if (asistenteId !== undefined) {
      where.asistente_id = asistenteId;
    }

    const [data, total] = await Promise.all([
      prisma.inscripciones_meet.findMany({
        where,
        orderBy: {
          id: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inscripciones_meet.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }

  async obtenerPorId(id: number) {
    return prisma.inscripciones_meet.findFirst({
      where: {
        id,
        state: {
          not: "REMOVED",
        },
      },
    });
  }

  async crear(asistenteId: number, showId: number) {
    return prisma.inscripciones_meet.create({
      data: {
        asistente_id: asistenteId,
        show_id: showId,
        state: "ACTIVE",
      },
    });
  }

  async actualizarShow(id: number, showId: number) {
    return prisma.inscripciones_meet.update({
      where: {
        id,
      },
      data: {
        show_id: showId,
        updated_at: new Date(),
      },
    });
  }

  async eliminar(id: number) {
    return prisma.inscripciones_meet.update({
      where: {
        id,
      },
      data: {
        state: "REMOVED",
        updated_at: new Date(),
      },
    });
  }

  async existeAsistente(id: number) {
    const asistente = await prisma.asistentes.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return asistente !== null;
  }

  async obtenerShow(id: number) {
    return prisma.shows.findUnique({
      where: {
        id,
      },
    });
  }

  async tieneBoletaVipOPlatino(
    asistenteId: number,
    diaId: number
  ) {
    const boleta = await prisma.boletas.findFirst({
      where: {
        asistente_id: asistenteId,
        dia_id: diaId,
        state: "ACTIVE",
        tipo: {
          in: ["VIP", "PLATINO"],
        },
      },
    });

    return boleta !== null;
  }

  async existeInscripcionActiva(
    asistenteId: number,
    showId: number,
    excluirId?: number
  ) {
    const inscription = await prisma.inscripciones_meet.findFirst({
      where: {
        asistente_id: asistenteId,
        show_id: showId,
        state: "ACTIVE",
        ...(excluirId !== undefined
          ? {
              id: {
                not: excluirId,
              },
            }
          : {}),
      },
    });

    return inscription !== null;
  }

  async contarInscripcionesActivas(showId: number) {
    return prisma.inscripciones_meet.count({
      where: {
        show_id: showId,
        state: "ACTIVE",
      },
    });
  }

  async obtenerInscripcionesActivasPorShow(showId: number) {
    return prisma.inscripciones_meet.findMany({
      where: {
        show_id: showId,
        state: "ACTIVE",
      },
      orderBy: {
        id: "asc",
      },
      select: {
        asistente_id: true,
        asistentes: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }
}