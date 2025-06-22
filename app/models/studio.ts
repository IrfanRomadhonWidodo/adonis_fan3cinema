// app/Models/Studio.ts
import { DateTime } from 'luxon'
// import { BaseModel, column } from '@adonisjs/lucid/orm'
import {
  BaseModel,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Jadwal from './jadwal.js'

export default class Studio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_studio: string

  @column()
  declare kapasitas: number

    @hasMany(() => Jadwal, {
    foreignKey: 'studio_id'
  })
  declare films: HasMany<typeof Jadwal>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}