/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotFoundException } from '@nestjs/common';

import { type Prisma, type Kategori } from '@prisma/client';
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
    const newFoto = this.upload.resizeImage({
      fileIs: data.foto,
      fileName: data.foto.filename,
      filePath: 'laporan',
    });

    const newBA = this.upload.uploadFile({
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
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      data.laporan_anomali_id,
    );

    const newFoto = this.upload.resizeImage({
      fileIs: data.foto,
      fileName: data.foto.filename,
      filePath: 'laporan-tindak-lanjut',
    });

    const newBA = this.upload.uploadFile({
      fileIs: data.berita_acara,
      fileName: data.berita_acara.filename,
      filePath: 'laporan-tindak-lanjut',
    });

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
  ) {
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      laporan_anomali_id,
    );

    let foto;
    let berita_acara;

    if (data.foto) {
      foto = this.upload.resizeImage({
        fileIs: data.foto,
        fileName: data.foto.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    if (data.berita_acara) {
      berita_acara = this.upload.uploadFile({
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
    user_id: string,
  ) {
    const isLaporanTindakLanjutExist = await this.checkLaporanTindakLanjut(
      laporan_tindak_lanjut_id,
    );

    let foto;
    let berita_acara;

    if (data.foto) {
      foto = this.upload.resizeImage({
        fileIs: data.foto,
        fileName: data.foto.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

    if (data.berita_acara) {
      berita_acara = this.upload.uploadFile({
        fileIs: data.berita_acara,
        fileName: data.berita_acara.filename,
        filePath: 'laporan-tindak-lanjut',
      });
    }

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
        },
      });
    }

    delete data.status;
    delete data.kategori;

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
      },
    });

    if (!laporan) {
      throw new NotFoundException('Laporan Anomali tidak ditemukan');
    }

    return laporan;
  }
}
