/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Prisma, type KategoriPeralatan } from '@prisma/client';
import { type Response } from 'express';
import xlsx, { type ISettings } from 'json-as-xlsx';
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
    private readonly config: ConfigService,
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
    page,
    perPage,
  }: // search,
  {
    ultg_id?: string;
    gi_id?: string;
    jenis_peralatan_id?: string;
    bay_id?: string;
    page?: number;
    perPage?: number;
    // search?: string;
  }) {
    const sanitizedPage = Number.isNaN(page) ? 1 : page;
    const sanitizedPerPage = Number.isNaN(perPage) ? 10 : perPage;

    const skip = sanitizedPage > 0 ? sanitizedPerPage * (page - 1) : 0;

    const whereOptions: Prisma.alatWhereInput = {
      ultg_id,
      gi_id,
      jenis_peralatan_id,
      bay_id,
    };

    const findOptions: Prisma.alatFindManyArgs = {
      where: whereOptions,
      select: {
        id: true,
        merk: true,
        tipe: true,
      },
    };

    if (!Number.isNaN(perPage) && !Number.isNaN(perPage)) {
      findOptions.skip = skip;
      findOptions.take = perPage;
    }

    const [total, data] = await Promise.all([
      this.prisma.alat.count({
        where: whereOptions,
      }),
      this.prisma.alat.findMany({
        ...findOptions,
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
      data,
    };

    // return await this.prisma.alat.findMany({
    //   where: {
    //     ultg_id,
    //     gi_id,
    //     jenis_peralatan_id,
    //     bay_id,
    //   },
    //   select: {
    //     id: true,
    //     merk: true,
    //     tipe: true,
    //   },
    // });
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

  async unduhAlat({
    response,
    awal,
    akhir,
  }: {
    response: Response;
    awal?: string;
    akhir?: string;
  }) {
    const fileName = 'List Alat';
    const data = await this.prisma.alat.findMany({
      where: {},
      include: {
        ultg: {
          select: {
            nama: true,
          },
        },
        gi: {
          select: {
            nama: true,
          },
        },
        jenis_peralatan: {
          select: {
            nama: true,
          },
        },
        bay: {
          select: {
            nama_lokasi: true,
            funloc_id: true,
          },
        },
        pembuat: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedData = [
      {
        sheet: 'List Alat',
        columns: [
          { label: 'ID Alat', value: 'id' },
          { label: 'ULTG', value: 'ultg' },
          { label: 'GI', value: 'gi' },
          { label: 'Jenis Peralatan', value: 'jenis_peralatan' },
          { label: 'Nama Lokasi', value: 'bay' },
          { label: 'Funloc ID', value: 'funloc_id' },
          { label: 'Pembuat', value: 'pembuat' },
          { label: 'Techidentno (TID)', value: 'techidentno' },
          { label: 'Kategori Peralatan', value: 'kategori_peralatan' },
          {
            label: 'Kategori Peralatan Detail',
            value: 'kategori_peralatan_detail',
          },
          { label: 'Tanggal Operasi', value: 'tanggal_operasi' },
          { label: 'Serial ID', value: 'serial_id' },
          { label: 'Fasa Terpasang', value: 'fasa_terpasang' },
          { label: 'Mekanik Penggerak', value: 'mekanik_penggerak' },
          { label: 'Media Pemadam', value: 'media_pemadam' },
          { label: 'Tipe', value: 'tipe' },
          { label: 'Merk', value: 'merk' },
          { label: 'Negara', value: 'negara_pembuat' },
          { label: 'Tahun', value: 'tahun_pembuatan' },
          { label: 'Tegangan Operasi', value: 'tegangan_operasi' },
          { label: 'Rating Arus', value: 'rating_arus' },
          { label: 'Breaking Current', value: 'breaking_current' },
          { label: 'Penempatan', value: 'penempatan' },
          { label: 'Ratio', value: 'ratio' },
          { label: 'Jenis CVT', value: 'jenis_cvt' },
          { label: 'Impedansi', value: 'impedansi' },
          { label: 'Daya', value: 'daya' },
          { label: 'Vector', value: 'vector' },
          { label: 'Arus Discharge NominaL', value: 'arus_dn' },
          { label: 'Nameplate', value: 'nameplate' },
          { label: 'Status', value: 'status' },
        ],
        content: data.map(item => ({
          id: item.id,
          ultg: item.ultg.nama,
          gi: item.gi.nama,
          jenis_peralatan: item.jenis_peralatan.nama,
          bay: item.bay.nama_lokasi,
          funloc_id: item.bay.funloc_id,
          pembuat: item.pembuat.username,
          techidentno: item.techidentno,
          kategori_peralatan: item.kategori_peralatan,
          kategori_peralatan_detail: item.kategori_peralatan_detail,
          tanggal_operasi: item.tanggal_operasi
            ? this.formatDate(item.tanggal_operasi.toISOString())
            : '',
          serial_id: item.serial_id,
          fasa_terpasang: item.fasa_terpasang,
          mekanik_penggerak: item.mekanik_penggerak,
          media_pemadam: item.media_pemadam,
          tipe: item.tipe,
          merk: item.merk,
          negara_pembuat: item.negara_pembuat,
          tahun_pembuatan: item.tahun_pembuatan,
          tegangan_operasi: item.tegangan_operasi,
          rating_arus: item.rating_arus,
          breaking_current: item.breaking_current,
          penempatan: item.penempatan,
          ratio: item.ratio,
          jenis_cvt: item.jenis_cvt,
          impedansi: item.impedansi,
          daya: item.daya,
          vector: item.vector,
          arus_dn: item.arus_dn,
          nameplate: item.nameplate
            ? `${this.config.get('BASE_URL')}/${item.nameplate}`
            : '',
          status: item.status,
        })),
      },
    ];

    const settings: ISettings = {
      fileName,
      writeOptions: {
        type: 'buffer',
        bookType: 'xlsx',
      },
    };

    const result = xlsx(formattedData, settings);

    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': `attachment; filename=${fileName}.xlsx`,
    });

    response.end(result);
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
