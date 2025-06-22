// app/controllers/FilmsController.ts
import { HttpContext } from '@adonisjs/core/http'
import Jadwal from '#models/jadwal'
import Genre from '#models/genre'

export default class FilmsController {
  async filter({ request, view, auth }: HttpContext) {
    const { date, genre } = request.all()
    
    console.log('Filter received:', { date, genre }) // Debug log

    // Ambil data untuk form
    const dates = await Jadwal.query()
      .distinct('tanggal')
      .orderBy('tanggal', 'asc')
      .exec()

    const genres = await Genre.all()

    // Perbaiki query - jangan filter di preload film
    let schedulesQuery = Jadwal.query()
      .preload('film', (filmQuery) => {
        filmQuery.preload('genre')
      })
      .preload('studio')

    // Filter berdasarkan tanggal
    if (date) {
      schedulesQuery = schedulesQuery.whereRaw('DATE(tanggal) = ?', [date])
    }

    // Filter berdasarkan genre - gunakan whereHas
    if (genre) {
      schedulesQuery = schedulesQuery.whereHas('film', (filmQuery) => {
        filmQuery.where('genre_id', genre)
      })
    }

    const schedules = await schedulesQuery
      .orderBy('tanggal', 'asc')
      .orderBy('jam', 'asc')
      .exec()

    console.log('Found schedules:', schedules.length) // Debug log

    return view.render('partials/film-schedules', {
      dates,
      genres,
      schedules: schedules || [],
      user: auth.user,
      input: { date, genre },
    })
  }
}