import { DateTime } from 'luxon'
import { HttpContext } from '@adonisjs/core/http'
import Tiket from '#models/tiket'
import Jadwal from '#models/jadwal'

export default class AdminTiketController {
  async index({ view, request }: HttpContext) {
    if (request.header('accept')?.includes('application/json')) {
      const tikets = await Tiket.query()
        .preload('jadwal', (query) => {
          query.preload('film')
          query.preload('studio')
        })
        .orderBy('id', 'asc')
      return tikets
    }

    const tikets = await Tiket.query()
      .preload('jadwal', (query) => {
        query.preload('film')
        query.preload('studio')
      })
      .orderBy('id', 'asc')
    
    const jadwals = await Jadwal.query()
      .preload('film')
      .preload('studio')
      .orderBy('tanggal', 'asc')
      .orderBy('jam', 'asc')
    
    return view.render('tiket-manager', { 
      tikets,
      jadwals,
      formatDate: (date: DateTime) => date.toFormat('dd/MM/yyyy')
    })
  }

  async store({ request, response }: HttpContext) {
    try {
      const { jadwalId, harga, status } = request.only([
        'jadwalId',
        'harga',
        'status'
      ])

      if (!jadwalId || !harga || !status) {
        return response.status(400).json({ 
          error: 'Jadwal, harga, dan status harus diisi!' 
        })
      }

      const parsedHarga = Number(harga)
      if (isNaN(parsedHarga) || parsedHarga <= 0) {
        return response.status(400).json({ 
          error: 'Harga harus berupa angka positif!' 
        })
      }

      if (!['tersedia', 'terjual'].includes(status)) {
        return response.status(400).json({ 
          error: 'Status harus "tersedia" atau "terjual"' 
        })
      }

      const tiket = await Tiket.create({
        jadwalId,
        harga: parsedHarga,
        status: status as 'tersedia' | 'terjual'
      })

      return response.json({ 
        success: true, 
        data: await Tiket.query()
          .where('id', tiket.id)
          .preload('jadwal', (query) => {
            query.preload('film')
            query.preload('studio')
          })
          .first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const tiket = await Tiket.query()
        .where('id', params.id)
        .preload('jadwal', (query) => {
          query.preload('film')
          query.preload('studio')
        })
        .firstOrFail()
      return response.json(tiket)
    } catch (error) {
      return response.status(404).json({ error: 'Tiket tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const tiket = await Tiket.findOrFail(params.id)
      const { jadwalId, harga, status } = request.only([
        'jadwalId',
        'harga',
        'status'
      ])

      if (!jadwalId || !harga || !status) {
        return response.status(400).json({ 
          error: 'Jadwal, harga, dan status harus diisi!' 
        })
      }

      const parsedHarga = Number(harga)
      if (isNaN(parsedHarga) || parsedHarga <= 0) {
        return response.status(400).json({ 
          error: 'Harga harus berupa angka positif!' 
        })
      }

      if (!['tersedia', 'terjual'].includes(status)) {
        return response.status(400).json({ 
          error: 'Status harus "tersedia" atau "terjual"' 
        })
      }

      await tiket.merge({
        jadwalId,
        harga: parsedHarga,
        status: status as 'tersedia' | 'terjual'
      }).save()

      return response.json({ 
        success: true, 
        data: await Tiket.query()
          .where('id', tiket.id)
          .preload('jadwal', (query) => {
            query.preload('film')
            query.preload('studio')
          })
          .first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const tiket = await Tiket.findOrFail(params.id)
      await tiket.delete()
      return response.json({ success: true })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}