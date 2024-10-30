/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type PIC, type Prisma, type Kategori } from '@prisma/client';
import { type Response } from 'express';
import xlsx, { type ISettings } from 'json-as-xlsx';
import { UploadService } from 'upload/upload.service';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { getTime } from 'utils';

import {
  type CreateRencanaPenyelesaianDto,
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
    private readonly config: ConfigService,
  ) {}

  async createLaporanAnomali(
    data: CreateLaporanAnomaliDto,
    user_id: string,
    foto?: Express.Multer.File[],
    berita_acara?: Express.Multer.File[],
  ) {
    const fotoPath = foto ? `uploads/laporan/${foto[0].filename}` : null;

    let beritaAcaraPath = berita_acara
      ? `uploads/laporan/${berita_acara[0].filename}`
      : null;

    beritaAcaraPath = data.berita_acara_url ?? beritaAcaraPath;

    delete data.foto;
    delete data.berita_acara;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const batas_waktu = this.getBatasWaktu(data.kategori);

    const total = await this.prisma.laporan_anomali.count();
    const nextNumber = total + 1;
    const formattedNumber = nextNumber.toString().padStart(6, '0');
    // const ultg_id = data.ultg_id;
    // delete data.ultg_id;

    delete data.berita_acara_url;

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

    let newBA = berita_acara
      ? `uploads/laporan/${berita_acara[0].filename}`
      : null;

    newBA = data.berita_acara_url ?? newBA;

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

    delete data.berita_acara_url;

    return await this.prisma.laporan_tindak_lanjut.create({
      data: {
        ...data,
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
    const isLaporanAnomaliExist = await this.checkLaporanAnomali(
      laporan_anomali_id,
    );

    let fotoPath;

    if (data.is_delete_foto === true) {
      fotoPath = null;
    } else if (data.is_delete_foto === false) {
      fotoPath = foto
        ? `uploads/laporan/${foto[0].filename}`
        : isLaporanAnomaliExist.foto;
    }

    let beritaAcaraPath;

    if (data.is_delete_berita_acara === true) {
      beritaAcaraPath = null;
    } else if (data.is_delete_berita_acara === false) {
      beritaAcaraPath = berita_acara
        ? `uploads/laporan/${berita_acara[0].filename}`
        : isLaporanAnomaliExist.berita_acara;
    }

    delete data.foto;
    delete data.berita_acara;
    delete data.is_delete_berita_acara;
    delete data.is_delete_foto;
    delete data.berita_acara_url;

    return await this.prisma.laporan_anomali.update({
      where: { id: laporan_anomali_id },
      data: {
        ...data,
        direview_oleh: data.status_review
          ? user_id
          : isLaporanAnomaliExist.direview_oleh,
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
    delete data.berita_acara_url;

    return await this.prisma.laporan_tindak_lanjut.update({
      where: { id: laporan_tindak_lanjut_id },
      data: {
        ...data,
        foto: fotoPath || isLaporanTindakLanjutExist.foto,
        berita_acara:
          beritaAcaraPath || isLaporanTindakLanjutExist.berita_acara,
      },
    });
  }

  async getTotalLaporanAnomali({
    bulan,
    tahun,
  }: {
    bulan?: string;
    tahun?: string;
  }) {
    const monthMap: Record<string, number> = {
      Januari: 1,
      Februari: 2,
      Maret: 3,
      April: 4,
      Mei: 5,
      Juni: 6,
      Juli: 7,
      Agustus: 8,
      September: 9,
      Oktober: 10,
      November: 11,
      Desember: 12,
    };

    // Convert the month name to a number
    const month = bulan ? monthMap[bulan] : null;
    const year = tahun ? Number.parseInt(tahun, 10) : null;

    // Construct the date range for the given month and year
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month !== null && year !== null) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month
    }

    // Fetch the grouped data
    const data = await this.prisma.laporan_anomali.groupBy({
      by: ['ultg_id', 'status'],
      where: {
        status: {
          in: ['OPEN', 'CLOSE'],
        },
        tanggal_laporan:
          startDate && endDate
            ? {
                gte: startDate,
                lt: endDate,
              }
            : undefined,
      },
      _count: {
        id: true,
      },
      orderBy: {
        ultg_id: 'asc',
      },
    });

    // Reformat data to ensure each `ultg_id` has both `OPEN` and `CLOSE` statuses
    const result = data.reduce((accumulator, current) => {
      const { ultg_id, status, _count } = current;

      // Find or initialize the entry for the current ultg_id
      let ultgEntry = accumulator.find(entry => entry.ultg_id === ultg_id);

      if (!ultgEntry) {
        ultgEntry = { ultg_id, statuses: { OPEN: 0, CLOSE: 0 } };
        accumulator.push(ultgEntry);
      }

      // Assign the count to the appropriate status
      if (status === 'OPEN' || status === 'CLOSE') {
        ultgEntry.statuses[status] = _count.id;
      }

      return accumulator;
    }, [] as Array<{ ultg_id: string; statuses: { OPEN: number; CLOSE: number } }>);

    // Convert the result back into the desired format
    return result.flatMap(entry => [
      {
        ultg_id: entry.ultg_id,
        status: 'OPEN',
        _count: { id: entry.statuses.OPEN },
      },
      {
        ultg_id: entry.ultg_id,
        status: 'CLOSE',
        _count: { id: entry.statuses.CLOSE },
      },
    ]);
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

  async getLaporanAnomali({
    where,
    page,
    perPage,
    search,
  }: {
    where?: Prisma.laporan_anomaliWhereInput;
    page?: number;
    perPage?: number;
    search?: string | undefined;
  }) {
    const skip = page > 0 ? perPage * (page - 1) : 0;

    if (search) {
      where = {
        OR: [
          {
            anomali: {
              contains: search,
            },
          },
          {
            jenis_peralatan: {
              nama: {
                contains: search,
              },
            },
          },
          {
            kategori_peralatan_detail: {
              contains: search,
            },
          },
          {
            detail_anomali: {
              contains: search,
            },
          },
          {
            tindak_lanjut_awal: {
              contains: search,
            },
          },
          {
            laporan_anomali_id: {
              contains: search,
            },
          },
        ],
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.laporan_anomali.count({
        where,
      }),
      this.prisma.laporan_anomali.findMany({
        skip,
        take: perPage,
        where,
        orderBy: [
          { status: 'asc' },
          { status_review: 'desc' },
          { created_at: 'desc' },
        ],
        select: {
          id: true,
          anomali: true,
          tanggal_laporan: true,
          tanggal_rusak: true,
          batas_waktu: true,
          status: true,
          kategori: true,
          status_review: true,
        },
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
        pereview: {
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
        rencana_penyelesaian: {
          select: {
            nama_pembuat: true,
            tanggal_rencana: true,
            deskripsi: true,
            pembuat: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!laporan) {
      throw new NotFoundException('Laporan Anomali tidak ditemukan');
    }

    return laporan;
  }

  async unduhLaporan({
    tipe,
    awal,
    akhir,
    response,
  }: {
    tipe?: string;
    awal?: string;
    akhir?: string;
    response: Response;
  }) {
    let fileName;
    let result;

    switch (tipe) {
      case 'Laporan Anomali': {
        fileName = `Laporan Anomali`;
        result = await this.unduhLaporanAnomali(fileName, awal, akhir);
        break;
      }

      case 'Tindak Lanjut': {
        fileName = `Laporan Tindak Lanjut`;
        result = await this.unduhTindakLanjut(fileName, awal, akhir);
        break;
      }
    }

    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': `attachment; filename=${fileName}.xlsx`,
    });

    response.end(result);
  }

  async unduhLaporanAnomali(fileName: string, awal?: string, akhir?: string) {
    const where: Prisma.laporan_anomaliWhereInput = awal
      ? {
          tanggal_laporan: {
            gte: awal,
            lte: akhir,
          },
        }
      : {};

    const data = await this.prisma.laporan_anomali.findMany({
      where,
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
        alat: {
          select: {
            techidentno: true,
          },
        },
      },
    });

    const formattedData = [
      {
        sheet: 'Laporan Anomali',
        columns: [
          { label: 'ID Laporan Anomali', value: 'id' },
          { label: 'ULTG', value: 'ultg' },
          { label: 'GI', value: 'gi' },
          { label: 'Jenis Peralatan', value: 'jenis_peralatan' },
          { label: 'Nama Lokasi', value: 'bay' },
          { label: 'Funloc ID', value: 'funloc_id' },
          { label: 'Techidentno (TID)', value: 'funloc_id' },
          { label: 'ID Alat', value: 'alat_id' },
          { label: 'Kategori Peralatan', value: 'kategori_peralatan' },
          {
            label: 'Kategori Peralatan Detail',
            value: 'kategori_peralatan_detail',
          },
          { label: 'Anomali', value: 'anomali' },
          { label: 'Detail Anomali', value: 'detail_anomali' },
          { label: 'Kategori Laporan', value: 'kategori' },
          { label: 'Tanggal Rusak', value: 'tanggal_rusak' },
          { label: 'Tanggal Laporan', value: 'tanggal_laporan' },
          { label: 'Tenggat Waktu', value: 'batas_waktu' },
          { label: 'Tindak Lanjut Awal', value: 'tindak_lanjut_awal' },
          { label: 'Link Foto', value: 'foto' },
          { label: 'Link Berita Acara', value: 'berita_acara' },
          { label: 'PIC', value: 'pic' },
          { label: 'Detail PIC', value: 'detail_pic' },
          { label: 'Nama Pelapor', value: 'nama_pembuat' },
          { label: 'Status', value: 'status' },
          { label: 'ID Laporan Anomali', value: 'laporan_anomali_id' },
        ],
        content: data.map(item => ({
          id: item.laporan_anomali_id,
          kategori_peralatan: item.kategori_peralatan ?? '',
          kategori_peralatan_detail: item.kategori_peralatan_detail ?? '',
          anomali: item.anomali,
          detail_anomali: item.detail_anomali ?? '',
          kategori: item.kategori || '',
          tanggal_rusak: this.formatDate(item.tanggal_rusak.toISOString()),
          tanggal_laporan: this.formatDate(item.tanggal_laporan.toISOString()),
          batas_waktu: this.formatDate(item.batas_waktu.toISOString()),
          tindak_lanjut_awal: item.tindak_lanjut_awal || '',
          foto: this.formatLink(item.foto),
          berita_acara: this.formatLink(item.berita_acara),
          pic: item.pic ?? '',
          detail_pic: item.detail_pic ?? '',
          nama_pembuat: item.nama_pembuat ?? '',
          status: item.status,
          laporan_anomali_id: item.laporan_anomali_id,
          ultg: item.ultg.nama,
          gi: item.gi.nama,
          jenis_peralatan: item.jenis_peralatan?.nama ?? '',
          bay: item.bay.nama_lokasi,
          funloc_id: item.bay.funloc_id,
          techidentno: item.alat?.techidentno ?? '',
          alat_id: item.alat_id,
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

    return xlsx(formattedData, settings);
  }

  async unduhTindakLanjut(fileName: string, awal?: string, akhir?: string) {
    const where: Prisma.laporan_tindak_lanjutWhereInput = awal
      ? {
          created_at: {
            gte: awal,
            lte: akhir,
          },
        }
      : {};

    const data = await this.prisma.laporan_tindak_lanjut.findMany({
      where,
      include: {
        pembuat: {
          select: {
            username: true,
          },
        },
        laporan_anomali: {
          select: {
            laporan_anomali_id: true,
          },
        },
      },
    });

    const formattedData = [
      {
        sheet: 'Laporan Tindak Lanjut',
        columns: [
          { label: 'ID', value: 'id' },
          { label: 'Kegiatan', value: 'kegiatan' },
          { label: 'Keterangan Kegiatan', value: 'ket_kegiatan' },
          { label: 'Material', value: 'material' },
          { label: 'Tanggal Submit', value: 'date_submit' },
          { label: 'Link Foto', value: 'foto' },
          { label: 'Link Berita Acara', value: 'berita_acara' },
          { label: 'Nama Pelapor', value: 'nama_pembuat' },
          { label: 'Nama Pembuat', value: 'pembuat' },
          { label: 'ID Laporan Anomali', value: 'laporan_anomali_id' },
        ],
        content: data.map(item => ({
          id: item.laporan_anomali.laporan_anomali_id,
          kegiatan: item.kegiatan,
          ket_kegiatan: item.ket_kegiatan ?? '',
          material: item.material || '',
          date_submit: this.formatDate(item.created_at.toISOString()),
          foto: this.formatLink(item.foto),
          berita_acara: this.formatLink(item.berita_acara),
          nama_pembuat: item.nama_pembuat ?? '',
          pembuat: item.pembuat.username,
          laporan_anomali_id: item.laporan_anomali_id,
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

    return xlsx(formattedData, settings);
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatLink(link?: string) {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    } else if (link) {
      return `http://157.173.221.186/${link}`;
    } else {
      return '';
    }
  }

  async createRencanaPenyelesaian(
    data: CreateRencanaPenyelesaianDto,
    user_id: string,
  ) {
    await this.checkLaporanAnomali(data.laporan_anomali_id);

    return await this.prisma.rencana_penyelesaian.create({
      data: {
        ...data,
        tanggal_rencana: new Date(data.tanggal_rencana),
        dibuat_oleh: user_id,
      },
    });
  }
}
