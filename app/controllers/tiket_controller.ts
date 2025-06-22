// app/controllers/tiket_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Jadwal from '#models/jadwal'
import Tiket from '#models/tiket'
import Studio from '#models/studio'
import { DateTime } from 'luxon'

export default class TiketController {
  /**
   * Menampilkan halaman pemesanan tiket
   */
  async index({ view }: HttpContext) {
    const today = DateTime.now().toFormat('yyyy-MM-dd')
    
    // Ambil semua jadwal hari ini dengan relasi film, studio, dan tiket
    const jadwals = await Jadwal.query()
      .where('tanggal', today)
      .preload('film')
      .preload('studio')
      .preload('jadwals', (query) => {
        query.where('status', 'tersedia')
      })
      .orderBy('jam', 'asc')

    // Hitung tiket tersedia berdasarkan kapasitas studio dikurangi tiket terjual
    const jadwalWithAvailableTickets = await Promise.all(
      jadwals.map(async (jadwal) => {
        // Hitung tiket yang sudah terjual
        const tiketTerjual = await Tiket.query()
          .where('jadwal_id', jadwal.id)
          .where('status', 'terjual')
          .count('* as total')

        const totalTiketTerjual = Number(tiketTerjual[0].$extras.total)
        const tiketTersedia = jadwal.studio.kapasitas - totalTiketTerjual

        return {
          ...jadwal.serialize(),
          tiketTersedia: Math.max(0, tiketTersedia) // Pastikan tidak negatif
        }
      })
    )

    return view.render('tiket/index', {
      jadwals: jadwalWithAvailableTickets
    })
  }

  /**
   * Proses pembelian tiket
   */
  async store({ request, response, session }: HttpContext) {
    const { jadwalId, jumlahTiket } = request.only(['jadwalId', 'jumlahTiket'])
    
    try {
      // Cek jadwal dan studio
      const jadwal = await Jadwal.query()
        .where('id', jadwalId)
        .preload('studio')
        .preload('film')
        .firstOrFail()

      // Hitung tiket yang sudah terjual
      const tiketTerjual = await Tiket.query()
        .where('jadwal_id', jadwalId)
        .where('status', 'terjual')
        .count('* as total')

      const totalTiketTerjual = Number(tiketTerjual[0].$extras.total)
      const tiketTersedia = jadwal.studio.kapasitas - totalTiketTerjual

      // Cek apakah masih ada tiket tersedia
      if (tiketTersedia < jumlahTiket) {
        session.flash('error', 'Tiket tidak mencukupi!')
        return response.redirect().back()
      }

      // Update status tiket menjadi terjual (jika ada tiket yang tersedia)
      const tiketTersediaDb = await Tiket.query()
        .where('jadwal_id', jadwalId)
        .where('status', 'tersedia')
        .limit(jumlahTiket)

      if (tiketTersediaDb.length >= jumlahTiket) {
        // Update tiket yang ada
        await Tiket.query()
          .whereIn('id', tiketTersediaDb.slice(0, jumlahTiket).map(t => t.id))
          .update({ status: 'terjual' })
      } else {
        // Jika tidak ada cukup tiket di database, buat tiket baru langsung sebagai terjual
        const hargaTiket = tiketTersediaDb.length > 0 ? tiketTersediaDb[0].harga : 50000
        
        for (let i = 0; i < jumlahTiket; i++) {
          await Tiket.create({
            jadwalId: jadwalId,
            harga: hargaTiket,
            status: 'terjual'
          })
        }
      }

      // Hitung harga (gunakan harga dari tiket yang ada atau default)
      const hargaTiket = tiketTersediaDb.length > 0 ? tiketTersediaDb[0].harga : 50000
      const totalHarga = hargaTiket * jumlahTiket

      // Generate kode referral random
      const kodeReferral = Math.random().toString(36).substring(2, 8).toUpperCase()

      session.flash('success', 'Tiket berhasil dibeli!')
      session.flash('pembelian_berhasil', true)
      session.flash('detail_pembelian', {
        film: jadwal.film.judul,
        studio: jadwal.studio?.nama,
        tanggal: jadwal.tanggal.toFormat('dd/MM/yyyy'),
        jam: jadwal.jam,
        jumlahTiket,
        totalHarga,
        kodeReferral
      })
      
      return response.redirect().back()

    } catch (error) {
      console.error('Error dalam pembelian tiket:', error)
      session.flash('error', 'Terjadi kesalahan saat membeli tiket!')
      return response.redirect().back()
    }
  }

  /**
   * API untuk mendapatkan detail jadwal dan harga
   */
  async getJadwalDetail({ params, response }: HttpContext) {
    try {
      const jadwal = await Jadwal.query()
        .where('id', params.id)
        .preload('film')
        .preload('studio')
        .firstOrFail()

      // Hitung tiket yang sudah terjual
      const tiketTerjual = await Tiket.query()
        .where('jadwal_id', params.id)
        .where('status', 'terjual')
        .count('* as total')

      const totalTiketTerjual = Number(tiketTerjual[0].$extras.total)
      const tiketTersedia = jadwal.studio.kapasitas - totalTiketTerjual

      // Ambil harga dari tiket yang ada atau gunakan harga default
      const tiketSample = await Tiket.query()
        .where('jadwal_id', params.id)
        .first()
      
      const hargaTiket = tiketSample?.harga || 50000

      return response.json({
        jadwal: jadwal.serialize(),
        tiketTersedia: Math.max(0, tiketTersedia),
        hargaTiket
      })
    } catch (error) {
      console.error('Error mengambil detail jadwal:', error)
      return response.status(404).json({ error: 'Jadwal tidak ditemukan' })
    }
  }
}