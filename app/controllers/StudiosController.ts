// app/Controllers/Http/StudiosController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Studio from '#models/studio'

export default class StudiosController {

  async getStudios({ view }: HttpContext) {
    const studios = await Studio.all()
    return view.render('partials/studio', { studios })
  }

}