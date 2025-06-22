// app/controllers/film_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import Jadwal from '#models/jadwal'
import Genre from '#models/genre'

export default class FilmsController {
  async filter({ request, view, auth }: HttpContext) {
  const { date, genre } = request.all()

  // Tambahkan data yang hilang
  const dates = await Jadwal.query()
    .distinct('tanggal')
    .orderBy('tanggal', 'asc')
    .exec()

  const genres = await Genre.all()

  const schedules = await Jadwal.query()
    .preload('film', (filmQuery) => {
      filmQuery.preload('genre')
      if (genre) {
        filmQuery.where('genre_id', genre)
      }
    })
    .preload('studio')
    .if(date, (query) => query.where('tanggal', date))
    .orderBy('tanggal', 'asc')
    .orderBy('jam', 'asc')
    .exec()

  return view.render('partials/film-schedules', {
    dates,        // Tambahkan ini
    genres,       // Tambahkan ini
    schedules: schedules || [],
    user: auth.user,  // Tambahkan ini
    input: { date, genre },
  })
}
}