// AdminStudioController
import { HttpContext } from '@adonisjs/core/http'
import Studio from '#models/studio'

export default class AdminStudioController {
  async index({ view, request }: HttpContext) {
    // Jika request adalah AJAX, return JSON
    if (request.header('accept')?.includes('application/json')) {
      const studios = await Studio.query().orderBy('id', 'asc')
      return studios
    }
    
    // Jika bukan AJAX, return view
    const studios = await Studio.query().orderBy('id', 'asc')
    return view.render('studio-manager', { studios })
  }

  async store({ request, response }: HttpContext) {
    try {
      // Terima namaStudio dari frontend tapi simpan sebagai nama_studio di database
      const { namaStudio, kapasitas } = request.only(['namaStudio', 'kapasitas'])
      
      if (!namaStudio || !kapasitas) {
        return response.status(400).json({ error: 'Nama studio dan kapasitas harus diisi!' })
      }
      
      const parsedKapasitas = Number(kapasitas)
      
      if (isNaN(parsedKapasitas) || parsedKapasitas <= 0) {
        return response.status(400).json({ error: 'Kapasitas harus berupa angka positif!' })
      }
      
      // Map namaStudio ke nama_studio untuk database
      const studio = await Studio.create({
        nama_studio: namaStudio,
        kapasitas: parsedKapasitas
      })
      
      return response.json({ success: true, data: studio })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      return response.json(studio)
    } catch (error) {
      return response.status(404).json({ error: 'Studio tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      const { namaStudio, kapasitas } = request.only(['namaStudio', 'kapasitas'])
      
      if (!namaStudio || !kapasitas) {
        return response.status(400).json({ error: 'Nama studio dan kapasitas harus diisi!' })
      }
      
      const parsedKapasitas = Number(kapasitas)
      
      if (isNaN(parsedKapasitas) || parsedKapasitas <= 0) {
        return response.status(400).json({ error: 'Kapasitas harus berupa angka positif!' })
      }
      
      // Map namaStudio ke nama_studio untuk database
      await studio.merge({
        nama_studio: namaStudio,
        kapasitas: parsedKapasitas
      }).save()
      
      return response.json({ success: true, data: studio })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const studio = await Studio.findOrFail(params.id)
      await studio.delete()
      return response.json({ success: true })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}