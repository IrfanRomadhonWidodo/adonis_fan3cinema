import { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import Genre from '#models/genre'

export default class AdminFilmController {
  async index({ view, request }: HttpContext) {
    if (request.header('accept')?.includes('application/json')) {
      const films = await Film.query()
        .preload('genre')
        .orderBy('id', 'asc')
      return films
    }

    const films = await Film.query()
      .preload('genre')
      .orderBy('id', 'asc')
    
    const genres = await Genre.all()
    
    return view.render('film-manager', { films, genres })
  }

  async store({ request, response }: HttpContext) {
    try {
      const { judul, sutradara, tahun, posterUrl, genreId } = request.only([
        'judul',
        'sutradara',
        'tahun',
        'posterUrl',
        'genreId'
      ])

      if (!judul || !sutradara || !tahun || !genreId) {
        return response.status(400).json({ 
          error: 'Judul, sutradara, tahun, dan genre harus diisi!' 
        })
      }

      const parsedYear = Number(tahun)
      if (isNaN(parsedYear)) {
        return response.status(400).json({ 
          error: 'Tahun harus berupa angka!' 
        })
      }

      const film = await Film.create({
        judul,
        sutradara,
        tahun: parsedYear,
        poster_url: posterUrl || null,
        genre_id: genreId
      })

      return response.json({ 
        success: true, 
        data: await Film.query().where('id', film.id).preload('genre').first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const film = await Film.query()
        .where('id', params.id)
        .preload('genre')
        .firstOrFail()
      return response.json(film)
    } catch (error) {
      return response.status(404).json({ error: 'Film tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const film = await Film.findOrFail(params.id)
      const { judul, sutradara, tahun, posterUrl, genreId } = request.only([
        'judul',
        'sutradara',
        'tahun',
        'posterUrl',
        'genreId'
      ])

      if (!judul || !sutradara || !tahun || !genreId) {
        return response.status(400).json({ 
          error: 'Judul, sutradara, tahun, dan genre harus diisi!' 
        })
      }

      const parsedYear = Number(tahun)
      if (isNaN(parsedYear)) {
        return response.status(400).json({ 
          error: 'Tahun harus berupa angka!' 
        })
      }

      await film.merge({
        judul,
        sutradara,
        tahun: parsedYear,
        poster_url: posterUrl || null,
        genre_id: genreId
      }).save()

      return response.json({ 
        success: true, 
        data: await Film.query().where('id', film.id).preload('genre').first()
      })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const film = await Film.findOrFail(params.id)
      await film.delete()
      return response.json({ success: true })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}