import { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import Jadwal from '#models/jadwal'
import Genre from '#models/genre'
import { DateTime } from 'luxon'

export default class FilmsController {
async index({ view, auth, request }: HttpContext) {
  try {
    // Get filter parameters from request
    const dateFilter = request.input('date')
    const genreFilter = request.input('genre')

    // Get all unique dates from schedules
    const dates = await Jadwal.query()
      .distinct('tanggal')
      .orderBy('tanggal', 'asc')
      .exec()

    // Get all genres
    const genres = await Genre.all()

    // Base query for films
    const filmQuery = Film.query()
      .preload('genre')
      .preload('jadwals', (query) => {
        query.preload('studio')
          .orderBy('tanggal', 'asc')
          .orderBy('jam', 'asc')
        
        if (dateFilter) {
          query.where('tanggal', dateFilter)
        }
      })
      .orderBy('judul', 'asc')

    // Apply genre filter if exists
    if (genreFilter) {
      filmQuery.where('genre_id', genreFilter)
    }

    const films = await filmQuery.exec()

    return view.render('partials/film-list', {
      films,
      dates: dates.map(jadwal => ({
        tanggal: jadwal.tanggal.toString() // Convert to string
      })),
      genres,
      user: auth.user,
      selectedDate: dateFilter, // Ini sudah string
      selectedGenre: genreFilter
    })
  } catch (error) {
    console.error(error)
    return view.render('errors/not-found')
  }
}
}