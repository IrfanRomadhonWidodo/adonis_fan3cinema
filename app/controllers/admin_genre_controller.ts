import { HttpContext } from '@adonisjs/core/http'
import Genre from '#models/genre'

export default class AdminGenreController {
  async index({ view, request }: HttpContext) {
    if (request.header('accept')?.includes('application/json')) {
      const genres = await Genre.query().orderBy('id', 'asc')
      return genres
    }

    const genres = await Genre.query().orderBy('id', 'asc')
    return view.render('genre-manager', { genres })
  }

  async store({ request, response }: HttpContext) {
    try {
      const { namaGenre } = request.only(['namaGenre'])

      if (!namaGenre) {
        return response.status(400).json({ error: 'Nama genre harus diisi!' })
      }

      const genre = await Genre.create({
        nama_genre: namaGenre
      })

      return response.json({ success: true, data: genre })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const genre = await Genre.findOrFail(params.id)
      return response.json(genre)
    } catch (error) {
      return response.status(404).json({ error: 'Genre tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const genre = await Genre.findOrFail(params.id)
      const { namaGenre } = request.only(['namaGenre'])

      if (!namaGenre) {
        return response.status(400).json({ error: 'Nama genre harus diisi!' })
      }

      await genre.merge({
        nama_genre: namaGenre
      }).save()

      return response.json({ success: true, data: genre })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const genre = await Genre.findOrFail(params.id)
      await genre.delete()
      return response.json({ success: true })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}