import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'

import type { HasMany } from '@adonisjs/lucid/types/relations'
import Film from './film.js'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_genre: string

  @hasMany(() => Film, {
    foreignKey: 'genre_id'
  })
  declare films: HasMany<typeof Film>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}