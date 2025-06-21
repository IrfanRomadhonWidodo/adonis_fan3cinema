import { HttpContext } from '@adonisjs/core/http'
import Jadwal from '#models/jadwal'
import Film from '#models/film'
import Studio from '#models/studio'
import { DateTime } from 'luxon'

export default class AdminJadwalController {
  async index({ view, request }: HttpContext) {
    if (request.header('accept')?.includes('application/json')) {
      const jadwals = await Jadwal.query()
        .preload('film')
        .preload('studio')
        .orderBy('tanggal', 'asc')
        .orderBy('jam', 'asc')
      return jadwals
    }

    const jadwals = await Jadwal.query()
      .preload('film')
      .preload('studio')
      .orderBy('tanggal', 'asc')
      .orderBy('jam', 'asc')
    
    const films = await Film.all()
    const studios = await Studio.all()
    
    return view.render('jadwal-manager', { 
      jadwals, 
      films,
      studios,
      formatDate: (date: DateTime) => date.toFormat('dd/MM/yyyy')
    })
  }

  async store({ request, response }: HttpContext) {
    try {
      const { filmId, studioId, tanggal, jam } = request.only([
        'filmId',
        'studioId',
        'tanggal',
        'jam'
      ])

      if (!filmId || !studioId || !tanggal || !jam) {
        return response.status(400).json({ 
          error: 'Film, studio, tanggal, dan jam harus diisi!' 
        })
      }

      // Validasi format tanggal
      const parsedDate = DateTime.fromFormat(tanggal, 'yyyy-MM-dd')
      if (!parsedDate.isValid) {
        return response.status(400).json({ 
          error: 'Format tanggal tidak valid!' 
        })
      }

      // Validasi jam
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(jam)) {
        return response.status(400).json({ 
          error: 'Format jam harus HH:MM!' 
        })
      }

      const jadwal = await Jadwal.create({
        filmId: filmId,
        studioId: studioId,
        tanggal: parsedDate,
        jam
      })

      return response.json({ 
        success: true, 
        data: await Jadwal.query()
          .where('id', jadwal.id)
          .preload('film')
          .preload('studio')
          .first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const jadwal = await Jadwal.query()
        .where('id', params.id)
        .preload('film')
        .preload('studio')
        .firstOrFail()
      return response.json(jadwal)
    } catch (error) {
      return response.status(404).json({ error: 'Jadwal tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const jadwal = await Jadwal.findOrFail(params.id)
      const { filmId, studioId, tanggal, jam } = request.only([
        'filmId',
        'studioId',
        'tanggal',
        'jam'
      ])

      if (!filmId || !studioId || !tanggal || !jam) {
        return response.status(400).json({ 
          error: 'Film, studio, tanggal, dan jam harus diisi!' 
        })
      }

      const parsedDate = DateTime.fromFormat(tanggal, 'yyyy-MM-dd')
      if (!parsedDate.isValid) {
        return response.status(400).json({ 
          error: 'Format tanggal tidak valid!' 
        })
      }

      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(jam)) {
        return response.status(400).json({ 
          error: 'Format jam harus HH:MM!' 
        })
      }

      await jadwal.merge({
        filmId: filmId,
        studioId: studioId,
        tanggal: parsedDate,
        jam
      }).save()

      return response.json({ 
        success: true, 
        data: await Jadwal.query()
          .where('id', jadwal.id)
          .preload('film')
          .preload('studio')
          .first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const jadwal = await Jadwal.findOrFail(params.id)
      await jadwal.delete()
      return response.json({ success: true })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}