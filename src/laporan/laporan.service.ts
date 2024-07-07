/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotFoundException } from '@nestjs/common';

import { type Kategori } from '@prisma/client';
import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

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

  async createLaporanAnomali(data: CreateLaporanAnomaliDto, user_id: string) {
    const newFoto = await this.upload.resizeImage({
      fileIs: data.foto,
      fileName: data.foto.filename,
      filePath: 'laporan',
    });

    const newBA = this.upload.uploadPdf({
      fileIs: data.berita_acara,
      fileName: data.berita_acara.filename,
      filePath: 'laporan',
    });

    delete data.foto;
    delete data.berita_acara;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const batas_waktu = this.getBatasWaktu(data.kategori);

    const total = await this.prisma.laporan_anomali.count();
    const nextNumber = total + 1;
    const formattedNumber = nextNumber.toString().padStart(6, '0');

    return await this.prisma.laporan_anomali.create({
      data: {
        ...data,
        tanggal_rusak: new Date(data.tanggal_rusak),
        tanggal_laporan: new Date(data.tanggal_laporan),
        batas_waktu,
        foto: newFoto,
        berita_acara: newBA,
        laporan_anomali_id: `LA-${formattedNumber}`,
        dibuat_oleh: user_id,
      },
    });
  }

  async createLaporanTindakLanjut(
    data: CreateLaporanTindakLanjutDto,
    user_id: string,
  ) {
    await this.checkLaporanAnomali(data.laporan_anomali_id);

    const newFoto = await this.upload.resizeImage({
      fileIs: data.foto,
      fileName: data.foto.filename,
      filePath: 'laporan-tindak-lanjut',
    });

    const newBA = this.upload.uploadPdf({
      fileIs: data.berita_acara,
      fileName: data.berita_acara.filename,
      filePath: 'laporan-tindak-lanjut',
    });

    delete data.foto;
    delete data.berita_acara;

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
  ) {
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      laporan_anomali_id,
    );

    let foto;
    let berita_acara;

    if (data.foto) {
      foto = await this.upload.resizeImage({
        fileIs: data.foto,
        fileName: data.foto.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    if (data.berita_acara) {
      berita_acara = this.upload.uploadPdf({
        fileIs: data.berita_acara,
        fileName: data.berita_acara.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    delete data.foto;
    delete data.berita_acara;

    return await this.prisma.laporan_anomali.update({
      where: { id: laporan_anomali_id },
      data: {
        ...data,
        foto: foto || isLaporanAnomaliExist.foto,
        berita_acara: berita_acara || isLaporanAnomaliExist.berita_acara,
        diedit_oleh: user_id,
        tanggal_rusak: data.tanggal_rusak
          ? new Date(data.tanggal_rusak)
          : isLaporanAnomaliExist.tanggal_rusak,
        tanggal_laporan: data.tanggal_laporan
          ? new Date(data.tanggal_laporan)
          : isLaporanAnomaliExist.tanggal_laporan,
      },
    });
  }

  async updateLaporanTindakLanjut(
    laporan_tindak_lanjut_id: string,
    data: UpdateLaporanTindakLanjutDto,
  ) {
    const isLaporanTindakLanjutExist = await this.checkLaporanTindakLanjut(
      laporan_tindak_lanjut_id,
    );

    let foto;
    let berita_acara;

    if (data.foto) {
      foto = await this.upload.resizeImage({
        fileIs: data.foto,
        fileName: data.foto.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    if (data.berita_acara) {
      berita_acara = this.upload.uploadPdf({
        fileIs: data.berita_acara,
        fileName: data.berita_acara.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    delete data.foto;
    delete data.berita_acara;

    return await this.prisma.laporan_tindak_lanjut.update({
      where: { id: laporan_tindak_lanjut_id },
      data: {
        ...data,
        foto: foto || isLaporanTindakLanjutExist.foto,
        berita_acara: berita_acara || isLaporanTindakLanjutExist.berita_acara,
        waktu_pengerjaan: data.waktu_pengerjaan
          ? new Date(data.waktu_pengerjaan)
          : isLaporanTindakLanjutExist.waktu_pengerjaan,
      },
    });
  }

  async getLaporanAnomali() {
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
}
