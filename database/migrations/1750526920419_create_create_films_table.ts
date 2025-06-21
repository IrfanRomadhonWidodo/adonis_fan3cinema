import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'films'

  async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID primary key
      table.string('judul').notNullable() // Judul film
      table.string('sutradara').notNullable() // Nama sutradara
      table.integer('tahun').notNullable() // Tahun (bisa juga pakai string/year)
      table.string('poster_url').nullable() // Link gambar poster

      // Relasi genre (1 genre bisa untuk banyak film)
      table
        .integer('genre_id')
        .unsigned()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE') // Hapus genre → film ikut terhapus

      table.timestamps(true, true) // created_at dan updated_at
    })
  }

  async down () {
    this.schema.dropTable(this.tableName)
  }
}
