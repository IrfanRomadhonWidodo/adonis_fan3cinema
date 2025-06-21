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

router.get('/admin', ({ view }) => {
  return view.render('admin/page_admin')
}).as('admin.page').use(middleware.auth())




// Studio route - hanya untuk mengambil data
router.get('/studios', [StudiosController, 'getStudios']).as('studios.get')

