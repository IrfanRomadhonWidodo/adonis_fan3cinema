import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tikets'

 async up() {
    this.schema.createTable('tikets', (table) => {
      table.increments('id')
      table
        .integer('jadwal_id')
        .unsigned()
        .references('id')
        .inTable('jadwals')
        .onDelete('CASCADE')
      table.integer('harga').notNullable()
      table.enum('status', ['tersedia', 'terjual']).defaultTo('tersedia')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}