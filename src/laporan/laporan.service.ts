/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotFoundException } from '@nestjs/common';

import { type PIC, type Prisma, type Kategori } from '@prisma/client';
import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { getTime } from 'utils';

import {
  type UpdateLaporanTindakLanjutDto,
  type UpdateLaporanAnomaliDto,
  type CreateLaporanTindakLanjutDto,
  type CreateLaporanAnomaliDto,
} from './dto';

@Injectable()
export class LaporanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
  ) {}

  async createLaporanAnomali(
    data: CreateLaporanAnomaliDto,
    user_id: string,
    foto?: Express.Multer.File[],
    berita_acara?: Express.Multer.File[],
  ) {
    const fotoPath = foto ? `uploads/laporan/${foto[0].filename}` : null;

    const beritaAcaraPath = berita_acara
      ? `uploads/laporan/${berita_acara[0].filename}`
      : null;

    delete data.foto;
    delete data.berita_acara;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const batas_waktu = this.getBatasWaktu(data.kategori);

    const total = await this.prisma.laporan_anomali.count();
    const nextNumber = total + 1;
    const formattedNumber = nextNumber.toString().padStart(6, '0');
    // const ultg_id = data.ultg_id;
    // delete data.ultg_id;

    return await this.prisma.laporan_anomali.create({
      data: {
        ...data,
        pic: data.pic as PIC,
        ultg_id: data.ultg_id,
        // tanggal_rusak: new Date(data.tanggal_rusak),
        tanggal_laporan: getTime(),
        batas_waktu,
        status: 'OPEN',
        foto: fotoPath,
        berita_acara: beritaAcaraPath,
        laporan_anomali_id: `LA-${formattedNumber}`,
        dibuat_oleh: user_id,
      },
    });
  }

  async createLaporanTindakLanjut(
    data: CreateLaporanTindakLanjutDto,
    user_id: string,
    foto?: Express.Multer.File[],
    berita_acara?: Express.Multer.File[],
  ) {
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      data.laporan_anomali_id,
    );

    const newFoto = foto ? `uploads/laporan/${foto[0].filename}` : null;

    const newBA = berita_acara
      ? `uploads/laporan/${berita_acara[0].filename}`
      : null;

    delete data.foto;
    delete data.berita_acara;

    if (data.status || data.kategori) {
      const newBatasWaktu = data.kategori
        ? this.getBatasWaktu(data.kategori)
        : isLaporanAnomaliExist.batas_waktu;

      await this.prisma.laporan_anomali.update({
        where: { id: data.laporan_anomali_id },
        data: {
          status: data.status,
          kategori: data.kategori,
          batas_waktu: newBatasWaktu,
          diedit_oleh: user_id,
        },
      });
    }

    delete data.status;
    delete data.kategori;

    return await this.prisma.laporan_tindak_lanjut.create({
      data: {
        ...data,
        waktu_pengerjaan: new Date(data.waktu_pengerjaan),
        dibuat_oleh: user_id,
        foto: newFoto,
        berita_acara: newBA,
      },
    });
  }

  async updateLaporanAnomali(
    laporan_anomali_id: string,
    data: UpdateLaporanAnomaliDto,
    user_id: string,
    foto?: Express.Multer.File[],
    berita_acara?: Express.Multer.File[],
  ) {
    console.log('data');
    console.log(data);
    console.log('nameplate');
    console.log(foto);
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      laporan_anomali_id,
    );

    const fotoPath = foto
      ? `uploads/laporan/${foto[0].filename}`
      : isLaporanAnomaliExist.foto;

    const beritaAcaraPath = berita_acara
      ? `uploads/laporan/${berita_acara[0].filename}`
      : isLaporanAnomaliExist.berita_acara;

    delete data.foto;
    delete data.berita_acara;

    return await this.prisma.laporan_anomali.update({
      where: { id: laporan_anomali_id },
      data: {
        ...data,
        pic: data.pic as PIC,
        foto: fotoPath,
        berita_acara: beritaAcaraPath,
        diedit_oleh: user_id,
      },
    });
  }

  async updateLaporanTindakLanjut(
    laporan_tindak_lanjut_id: string,
    data: UpdateLaporanTindakLanjutDto,
    user_id: string,
    nameplate?: Express.Multer.File,
    berita_acara?: Express.Multer.File,
  ) {
    console.log(data);
    const isLaporanTindakLanjutExist = await this.checkLaporanTindakLanjut(
      laporan_tindak_lanjut_id,
    );

    const fotoPath = nameplate
      ? `uploads/laporan/${nameplate.filename}`
      : isLaporanTindakLanjutExist.foto;

    const beritaAcaraPath = berita_acara
      ? `uploads/laporan/${berita_acara.filename}`
      : isLaporanTindakLanjutExist.berita_acara;

    delete data.foto;
    delete data.berita_acara;

    if (data.status || data.kategori) {
      const isLaporanAnomaliExist = await this.checkLaporanAnomali(
        isLaporanTindakLanjutExist.laporan_anomali_id,
      );

      const newBatasWaktu = data.kategori
        ? this.getBatasWaktu(data.kategori)
        : isLaporanAnomaliExist.batas_waktu;

      await this.prisma.laporan_anomali.update({
        where: { id: data.laporan_anomali_id },
        data: {
          status: data.status,
          kategori: data.kategori,
          batas_waktu: newBatasWaktu,
          diedit_oleh: user_id,
          foto: fotoPath,
          berita_acara: beritaAcaraPath,
        },
      });
    }

    delete data.status;
    delete data.kategori;

    return await this.prisma.laporan_tindak_lanjut.update({
      where: { id: laporan_tindak_lanjut_id },
      data: {
        ...data,
        foto: fotoPath || isLaporanTindakLanjutExist.foto,
        berita_acara:
          beritaAcaraPath || isLaporanTindakLanjutExist.berita_acara,
        waktu_pengerjaan: data.waktu_pengerjaan
          ? new Date(data.waktu_pengerjaan)
          : isLaporanTindakLanjutExist.waktu_pengerjaan,
      },
    });
  }

  async getTotalLaporanAnomali() {
    return await this.prisma.laporan_anomali.groupBy({
      by: ['ultg_id', 'status'],
      where: {
        status: {
          in: ['OPEN', 'CLOSE'],
        },
      },
      _count: {
        id: true,
      },
    });
  }

  getBatasWaktu(kategori: Kategori) {
    const today = new Date();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let batas_waktu;

    switch (kategori) {
      case 'K1': {
        batas_waktu = new Date(today);
        batas_waktu.setDate(today.getDate() + 30);
        break;
      }

      case 'K2': {
        batas_waktu = new Date(today);
        batas_waktu.setDate(today.getDate() + 45);
        break;
      }

      case 'K3': {
        batas_waktu = new Date(today);
        batas_waktu.setDate(today.getDate() + 60);
        break;
      }

      case 'K4': {
        batas_waktu = new Date(today);
        batas_waktu.setDate(today.getDate() + 90);
        break;
      }
    }

    return batas_waktu;
  }

  async checkLaporanAnomali(id: string) {
    const isLaporanAnomaliExist = await this.prisma.laporan_anomali.findFirst({
      where: { id },
    });

    if (!isLaporanAnomaliExist) {
      throw new NotFoundException('Laporan Anomali tidak ditemukan');
    }

    return isLaporanAnomaliExist;
  }

  async checkLaporanTindakLanjut(id: string) {
    const isLaporanTindakLanjutExist =
      await this.prisma.laporan_tindak_lanjut.findFirst({
        where: { id },
      });

    if (!isLaporanTindakLanjutExist) {
      throw new NotFoundException('Laporan Tindak Lanjut tidak ditemukan');
    }

    return isLaporanTindakLanjutExist;
  }

  async deleteLaporanAnomali(laporan_anomali_id: string) {
    await this.checkLaporanAnomali(laporan_anomali_id);

    return await this.prisma.laporan_anomali.update({
      where: { id: laporan_anomali_id },
      data: {
        status: 'DELETE',
      },
    });
  }

  async getLaporanAnomali(where?: Prisma.laporan_anomaliWhereInput) {
    return await this.prisma.laporan_anomali.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        anomali: true,
        tanggal_laporan: true,
        tanggal_rusak: true,
        batas_waktu: true,
        status: true,
        kategori: true,
      },
    });
  }

  async getDetailLaporanAnomali(laporan_anomali_id: string) {
    const laporan = await this.prisma.laporan_anomali.findFirst({
      where: { id: laporan_anomali_id },
      include: {
        laporan_tindak_lanjut: {
          select: {
            id: true,
            kegiatan: true,
            ket_kegiatan: true,
            waktu_pengerjaan: true,
            nama_pembuat: true,
            created_at: true,
            pembuat: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
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
        pengedit: {
          select: {
            username: true,
          },
        },
        bay: {
          select: {
            id: true,
            nama_lokasi: true,
          },
        },
        jenis_peralatan: {
          select: {
            id: true,
            nama: true,
          },
        },
        alat: {
          select: {
            id: true,
            techidentno: true,
            serial_id: true,
            fasa_terpasang: true,
            tipe: true,
            merk: true,
            negara_pembuat: true,
            tahun_pembuatan: true,
            status: true,
          },
        },
      },
    });

    if (!laporan) {
      throw new NotFoundException('Laporan Anomali tidak ditemukan');
    }

    return laporan;
  }
}
