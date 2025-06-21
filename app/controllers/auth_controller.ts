import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'

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
    try {
      const { fullName, email, password, passwordConfirmation } = request.only([
        'fullName',
        'email', 
        'password',
        'passwordConfirmation'
      ])

      // Basic validation
      const errors: Record<string, string> = {}

      // Validate fullName
      if (!fullName || fullName.trim().length < 3) {
        errors.fullName = 'Nama lengkap minimal 3 karakter'
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        errors.email = 'Format email tidak valid'
      }

      // Check if email already exists
      if (email) {
        const existingUser = await User.findBy('email', email)
        if (existingUser) {
          errors.email = 'Email sudah terdaftar'
        }
      }

      // Validate password
      if (!password || password.length < 6) {
        errors.password = 'Password minimal 6 karakter'
      }

      // Validate password confirmation
      if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Konfirmasi password tidak cocok'
      }

      // If there are validation errors
      if (Object.keys(errors).length > 0) {
        session.flash('errors', errors)
        session.flash('old', { fullName, email })
        return response.redirect().back()
      }

      // Create user
      const user = await User.create({
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        password,
      })

      await auth.use('web').login(user)

      session.flash('notification', {
        type: 'success',
        message: 'Akun berhasil dibuat! Selamat datang.'
      })

      return response.redirect('/home')

    } catch (error) {
      console.error('Registration error:', error)
      
      session.flash('notification', {
        type: 'error',
        message: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
      })
      
      return response.redirect().back()
    }
  }

  /**
   * Handle user login
   */
  async login({ request, response, auth, session }: HttpContext) {
    try {
      console.log('Login attempt started')
      
      const { email, password } = request.only(['email', 'password'])
      
      console.log('Login data:', { email: email, password: password ? '***' : 'empty' })

      // Basic validation
      const errors: Record<string, string> = {}

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        errors.email = 'Format email tidak valid'
      }

      // Validate password
      if (!password || password.trim() === '') {
        errors.password = 'Password wajib diisi'
      }

      // If there are validation errors
      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors)
        session.flash('errors', errors)
        session.flash('old', { email })
        return response.redirect().back()
      }

      // Attempt login
      try {
        console.log('Attempting to verify credentials...')
        const user = await User.verifyCredentials(email.toLowerCase(), password)
        console.log('User found:', { id: user.id, email: user.email })
        
        await auth.use('web').login(user)
        console.log('User logged in successfully')
        
        session.flash('notification', {
          type: 'success',
          message: 'Login berhasil! Selamat datang kembali.'
        })
        
        return response.redirect('/home')
        
      } catch (verifyError) {
        console.log('Credential verification failed:', verifyError.message)
        
        session.flash('notification', {
          type: 'error',
          message: 'Email atau password salah.'
        })
        
        session.flash('old', { email })
        return response.redirect().back()
      }

    } catch (error) {
      console.error('Login error:', error)
      
      session.flash('notification', {
        type: 'error',
        message: 'Terjadi kesalahan pada sistem. Silakan coba lagi.'
      })
      
      session.flash('old', { email: request.input('email') })
      return response.redirect().back()
    }
  }

  /**
   * Handle user logout
   */
  async logout({ response, auth, session }: HttpContext) {
    try {
      await auth.use('web').logout()
      
      session.flash('notification', {
        type: 'success',
        message: 'Logout berhasil. Sampai jumpa!'
      })
      
      return response.redirect('/login')

    } catch (error) {
      console.error('Logout error:', error)
      
      session.flash('notification', {
        type: 'error',
        message: 'Terjadi kesalahan saat logout.'
      })
      
      return response.redirect().back()
    }
  }
}