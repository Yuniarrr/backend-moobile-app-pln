import { Injectable, NotFoundException } from '@nestjs/common';

import { type KategoriPeralatan } from '@prisma/client';
import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import {
  type UpdateAlatDto,
  type UpdateJenisAlatDto,
  type CreateAlatDto,
  type CreateJenisAlatDto,
} from './dto';

@Injectable()
export class InventarisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
  ) {}

  async createJenisAlat(data: CreateJenisAlatDto) {
    return await this.prisma.jenis_peralatan.create({
      data: {
        ...data,
      },
    });
  }

  async createAlat(
    data: CreateAlatDto,
    user_id: string,
    nameplate?: Express.Multer.File,
  ) {
    await this.checkUltg(data.ultg_id);
    await this.checkGi(data.gi_id);
    await this.checkJenisPeralatan(data.jenis_peralatan_id);
    await this.checkBay(data.bay_id);

    const nameplatePath = nameplate
      ? `uploads/inventaris/${nameplate.filename}`
      : null;

    delete data.nameplate;

    return await this.prisma.alat.create({
      data: {
        ...data,
        nameplate: nameplatePath,
        tanggal_operasi: new Date(data.tanggal_operasi),
        dibuat_oleh: user_id,
      },
    });
  }

  async getJenisAlat(kategori_alat?: KategoriPeralatan) {
    return await this.prisma.jenis_peralatan.findMany({
      where: {
        kategori_peralatan: kategori_alat,
      },
    });
  }

  async getAlat({
    ultg_id,
    gi_id,
    jenis_peralatan_id,
    bay_id,
  }: // search,
  {
    ultg_id?: string;
    gi_id?: string;
    jenis_peralatan_id?: string;
    bay_id?: string;
    // search?: string;
  }) {
    return await this.prisma.alat.findMany({
      where: {
        ultg_id,
        gi_id,
        jenis_peralatan_id,
        bay_id,
        // nama: {
        //   contains: search,
        // },
      },
      select: {
        id: true,
        merk: true,
        tipe: true,
      },
    });
  }

  async updateJenisAlat(jenis_alat_id: string, data: UpdateJenisAlatDto) {
    await this.checkJenisPeralatan(jenis_alat_id);

    return await this.prisma.jenis_peralatan.update({
      where: { id: jenis_alat_id },
      data: {
        ...data,
      },
    });
  }

  async updateAlat(
    alat_id: string,
    data: UpdateAlatDto,
    nameplate?: Express.Multer.File,
  ) {
    const alat = await this.checkAlat(alat_id);

    const nameplatePath = nameplate
      ? `uploads/inventaris/${nameplate.filename}`
      : alat.nameplate;

    delete data.nameplate;

    return await this.prisma.alat.update({
      where: { id: alat_id },
      data: {
        ...data,
        nameplate: nameplatePath ?? alat.nameplate,
        tanggal_operasi: data.tanggal_operasi ?? alat.tanggal_operasi,
      },
    });
  }

  async getDetailAlat(alat_id: string) {
    return await this.prisma.alat.findFirst({
      where: { id: alat_id },
      include: {
        bay: {
          select: { nama_lokasi: true, id: true },
        },
        jenis_peralatan: {
          select: {
            id: true,
            nama: true,
          },
        },
        ultg: {
          select: {
            id: true,
            nama: true,
          },
        },
        gi: {
          select: {
            id: true,
            nama: true,
          },
        },
        pembuat: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async checkUltg(id: string) {
    const isUltgExist = await this.prisma.ultg.findFirst({
      where: { id },
    });

    if (!isUltgExist) {
      throw new NotFoundException('ULTG not found');
    }

    return isUltgExist;
  }

  async checkGi(id: string) {
    const isGiExist = await this.prisma.gi.findFirst({
      where: { id },
    });

    if (!isGiExist) {
      throw new NotFoundException('GI not found');
    }

    return isGiExist;
  }

  async checkJenisPeralatan(id: string) {
    const isJenisPeralatanExist = await this.prisma.jenis_peralatan.findFirst({
      where: { id },
    });

    if (!isJenisPeralatanExist) {
      throw new NotFoundException('Jenis Peralatan not found');
    }

    return isJenisPeralatanExist;
  }

  async checkBay(id: string) {
    const isBayExist = await this.prisma.bay.findFirst({
      where: { id },
    });

    if (!isBayExist) {
      throw new NotFoundException('Bay not found');
    }

    return isBayExist;
  }

  async checkAlat(id: string) {
    const isAlatExist = await this.prisma.alat.findFirst({
      where: { id },
    });

    if (!isAlatExist) {
      throw new NotFoundException('Alat not found');
    }

    return isAlatExist;
  }
}
