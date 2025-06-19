import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Display login form
   */
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  /**
   * Display register form
   */
  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  /**
   * Handle user registration
   */
  async register({ request, response, auth, session }: HttpContext) {
  const { fullName, email, password } = await request.validateUsing(registerValidator)

  const user = await User.create({
    fullName,
    email,
    password,
  })

  await auth.use('web').login(user)

  session.flash('notification', {
    type: 'success',
    message: 'Akun berhasil dibuat! Selamat datang.'
  })

  return response.redirect('/home')
}


  /**
   * Handle user login
   */
  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      
      session.flash('notification', {
        type: 'success',
        message: 'Login berhasil! Selamat datang kembali.'
      })
      
      return response.redirect('/home')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Email atau password salah.'
      })
      
      return response.redirect().back()
    }
  }

  /**
   * Handle user logout
   */
  async logout({ response, auth, session }: HttpContext) {
    await auth.use('web').logout()
    
    session.flash('notification', {
      type: 'success',
      message: 'Logout berhasil. Sampai jumpa!'
    })
    
    return response.redirect('/login')
  }
}