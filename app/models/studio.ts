// app/Models/Studio.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Studio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaStudio: string

  @column()
  declare kapasitas: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}