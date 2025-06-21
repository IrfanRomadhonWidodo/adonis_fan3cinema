import { HttpContext } from '@adonisjs/core/http'
import Studio from '#models/studio'

export default class AdminStudioController {
  /**
   * Display list of studios
   */
  async index({ view }: HttpContext) {
    const studios = await Studio.query().orderBy('id', 'desc')
    return view.render('admin/studio-manager', { studios })
  }

  /**
   * Handle form submission for creation
   */
  async store({ request, response, session }: HttpContext) {
    try {
      // Ambil data langsung dari request tanpa validasi
      const data = request.only(['namaStudio', 'kapasitas'])
      
      // Pastikan kapasitas adalah number
      data.kapasitas = Number(data.kapasitas)
      
      await Studio.create(data)
      
      session.flash('success', 'Studio berhasil ditambahkan!')
      return response.redirect().back()
    } catch (error) {
      console.error(error)
      session.flash('error', 'Terjadi kesalahan saat menambahkan studio')
      return response.redirect().back()
    }
  }

  /**
   * Show individual studio
   */
  async show({ params, response }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      return response.json(studio)
    } catch (error) {
      return response.status(404).json({ error: 'Studio tidak ditemukan' })
    }
  }

  /**
   * Handle form submission for update
   */
  async update({ params, request, response, session }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      const data = request.only(['namaStudio', 'kapasitas'])
      
      // Pastikan kapasitas adalah number
      if (data.kapasitas) {
        data.kapasitas = Number(data.kapasitas)
      }
      
      await studio.merge(data).save()
      
      session.flash('success', 'Studio berhasil diperbarui!')
      return response.redirect().back()
    } catch (error) {
      console.error(error)
      session.flash('error', 'Terjadi kesalahan saat memperbarui studio')
      return response.redirect().back()
    }
  }

  /**
   * Delete studio
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      await studio.delete()
      
      session.flash('success', 'Studio berhasil dihapus!')
      return response.redirect().back()
    } catch (error) {
      console.error(error)
      session.flash('error', 'Terjadi kesalahan saat menghapus studio')
      return response.redirect().back()
    }
  }
}