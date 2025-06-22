// app/models/tiket.ts
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Jadwal from './jadwal.js'

export default class Tiket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare jadwalId: number

  @column()
  declare harga: number

  @column()
  declare status: 'tersedia' | 'terjual'

  @belongsTo(() => Jadwal, {
    foreignKey: 'jadwalId',
  })
  declare jadwal: BelongsTo<typeof Jadwal>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
