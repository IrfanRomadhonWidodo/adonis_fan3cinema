import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Genre from './genre.js'

import type { HasMany } from '@adonisjs/lucid/types/relations'
import Jadwal from './jadwal.js'


export default class Film extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare judul: string

  @column()
  declare sutradara: string

  @column()
  declare tahun: number

  @column()
  declare poster_url: string | null

  @column()
  declare genre_id: number

  // Tambahkan foreignKey secara eksplisit
  @belongsTo(() => Genre, {
    foreignKey: 'genre_id'
  })
  declare genre: BelongsTo<typeof Genre>

  @hasMany(() => Jadwal, {
    foreignKey: 'jadwal_id'
  })
  declare films: HasMany<typeof Jadwal>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}