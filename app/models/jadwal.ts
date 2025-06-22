import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Film from './film.js'
import Studio from './studio.js'
import Tiket from './tiket.js'

export default class Jadwal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filmId: number

  @column()
  declare studioId: number

  @column.date()
  declare tanggal: DateTime

  @column()
  declare jam: string

  @belongsTo(() => Film)
  declare film: BelongsTo<typeof Film>

  @belongsTo(() => Studio)
  declare studio: BelongsTo<typeof Studio>

  @hasMany(() => Tiket, {
    foreignKey: 'tiket_id'
  })
  declare jadwals: HasMany<typeof Tiket>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
