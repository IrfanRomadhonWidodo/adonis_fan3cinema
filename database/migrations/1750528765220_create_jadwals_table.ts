import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jadwals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('film_id')
        .unsigned()
        .references('id')
        .inTable('films')
        .onDelete('CASCADE')
      table
        .integer('studio_id')
        .unsigned()
        .references('id')
        .inTable('studios')
        .onDelete('CASCADE')
      table.date('tanggal').notNullable()
      table.time('jam').notNullable()

      table.timestamps(true)

      table.unique(['studio_id', 'tanggal', 'jam'], 'unique_studio_schedule')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}