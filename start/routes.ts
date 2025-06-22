import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import Studio from '#models/studio'
import Film from '#models/film'



const AuthController = () => import('#controllers/auth_controller')
const StudiosController = () => import('#controllers/StudiosController')
const FilmsController = () => import('#controllers/FilmsController')
// Auth routes (hanya untuk guest/belum login)
router.group(() => {
  router.get('/login', [AuthController, 'showLogin']).as('auth.login.show')
  router.post('/login', [AuthController, 'login']).as('auth.login')
  router.get('/register', [AuthController, 'showRegister']).as('auth.register.show')  
  router.post('/register', [AuthController, 'register']).as('auth.register')

}).use(middleware.guest())



// Logout route (hanya untuk yang sudah login)
router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())




// Protected routes
router.get('/home', async ({ view, auth }) => {
  const studios = await Studio.all()
  const Jadwal = (await import('#models/jadwal')).default
  const Genre = (await import('#models/genre')).default

  const dates = await Jadwal.query()
    .distinct('tanggal')
    .orderBy('tanggal', 'asc')
    .exec()

  const genres = await Genre.all()

  const schedules = await Jadwal.query()
    .preload('film', (filmQuery) => {
      filmQuery.preload('genre')
    })
    .preload('studio')
    .orderBy('tanggal', 'asc')
    .orderBy('jam', 'asc')
    .exec()
  return view.render('home', {
    user: auth.user,
    studios,
    dates,        // Tambah ini
    genres,       // Tambah ini  
    schedules,    // Tambah ini
    input: { date: '', genre: '' }  // Tambah ini
  })
}).as('home').use(middleware.auth())

router.get('/films/schedules', [FilmsController, 'filter']).as('films.schedules').use(middleware.auth())



// Redirect root ke login jika belum login, ke home jika sudah login
router.get('/', ({ response, auth }) => {
  if (auth.user) {
    return response.redirect('/home')
  }
  return response.redirect('/login')
})


// Studio route - hanya untuk mengambil data
router.get('/studios', [StudiosController, 'getStudios']).as('studios.get')










//untuk studio manager CRUD
// Tambahkan route berikut ke dalam file start/routes.ts


import AdminStudioController from '#controllers/admin_studio_controller'

router.group(() => {
  router.get('/studios', [AdminStudioController, 'index']).as('admin.studios.index')
  router.post('/studios', [AdminStudioController, 'store']).as('admin.studios.store')
  router.get('/studios/:id', [AdminStudioController, 'show']).as('admin.studios.show')
  router.put('/studios/:id', [AdminStudioController, 'update']).as('admin.studios.update')
  router.delete('/studios/:id', [AdminStudioController, 'destroy']).as('admin.studios.destroy')
}).prefix('/admin')



import AdminGenreController from '#controllers/admin_genre_controller'

// Tambahkan dalam group admin
router.group(() => {
  router.get('/genres', [AdminGenreController, 'index']).as('admin.genres.index')
  router.post('/genres', [AdminGenreController, 'store']).as('admin.genres.store')
  router.get('/genres/:id', [AdminGenreController, 'show']).as('admin.genres.show')
  router.put('/genres/:id', [AdminGenreController, 'update']).as('admin.genres.update')
  router.delete('/genres/:id', [AdminGenreController, 'destroy']).as('admin.genres.destroy')
}).prefix('/admin').use(middleware.auth())



import AdminFilmController from '#controllers/admin_film_controller'

// Tambahkan dalam group admin
router.group(() => {
  router.get('/films', [AdminFilmController, 'index']).as('admin.films.index')
  router.post('/films', [AdminFilmController, 'store']).as('admin.films.store')
  router.get('/films/:id', [AdminFilmController, 'show']).as('admin.films.show')
  router.put('/films/:id', [AdminFilmController, 'update']).as('admin.films.update')
  router.delete('/films/:id', [AdminFilmController, 'destroy']).as('admin.films.destroy')
}).prefix('/admin').use(middleware.auth())

import AdminJadwalController from '#controllers/admin_jadwal_controller'

// Tambahkan dalam group admin
router.group(() => {
  router.get('/jadwals', [AdminJadwalController, 'index']).as('admin.jadwals.index')
  router.post('/jadwals', [AdminJadwalController, 'store']).as('admin.jadwals.store')
  router.get('/jadwals/:id', [AdminJadwalController, 'show']).as('admin.jadwals.show')
  router.put('/jadwals/:id', [AdminJadwalController, 'update']).as('admin.jadwals.update')
  router.delete('/jadwals/:id', [AdminJadwalController, 'destroy']).as('admin.jadwals.destroy')
}).prefix('/admin').use(middleware.auth())

import AdminTiketController from '#controllers/admin_tiket_controller'

// Tambahkan dalam group admin
router.group(() => {
  router.get('/tikets', [AdminTiketController, 'index']).as('admin.tikets.index')
  router.post('/tikets', [AdminTiketController, 'store']).as('admin.tikets.store')
  router.get('/tikets/:id', [AdminTiketController, 'show']).as('admin.tikets.show')
  router.put('/tikets/:id', [AdminTiketController, 'update']).as('admin.tikets.update')
  router.delete('/tikets/:id', [AdminTiketController, 'destroy']).as('admin.tikets.destroy')
}).prefix('/admin').use(middleware.auth())