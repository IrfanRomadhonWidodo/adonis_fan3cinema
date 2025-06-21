import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import Studio from '#models/studio'


const AuthController = () => import('#controllers/auth_controller')
const StudiosController = () => import('#controllers/StudiosController')

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
  return view.render('home', {
    user: auth.user,
    studios, 
  })
}).as('home').use(middleware.auth())

// Redirect root ke login jika belum login, ke home jika sudah login
router.get('/', ({ response, auth }) => {
  if (auth.user) {
    return response.redirect('/home')
  }
  return response.redirect('/login')
})









// Studio route - hanya untuk mengambil data
router.get('/studios', [StudiosController, 'getStudios']).as('studios.get')



///Untuk seluruh kelola admin

//dari home ke admin
// router.get('/admin', ({ view }) => {
//   return view.render('admin/studio-manager')
// }).as('admin.studio-manager').use(middleware.auth())






//untuk studio manager CRUD
// Tambahkan route berikut ke dalam file start/routes.ts


// Admin Studio Routes
const AdminStudioController = () => import('#controllers/AdminStudioController')

router.group(() => {
  router.get('/studios', [AdminStudioController, 'index']).as('admin.studios.index')
  router.post('/studios', [AdminStudioController, 'store']).as('admin.studios.store')
  router.get('/studios/:id', [AdminStudioController, 'show']).as('admin.studios.show')
  router.put('/studios/:id', [AdminStudioController, 'update']).as('admin.studios.update')
  router.delete('/studios/:id', [AdminStudioController, 'destroy']).as('admin.studios.destroy')
}).prefix('/admin')


