import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Product1744915919425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedTableName: 'location',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product');

    const category_fk = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('category_id'),
    );
    if (category_fk) {
      await queryRunner.dropForeignKey('product', category_fk);
    }

    const location_fk = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('location_id'),
    );
    if (location_fk) {
      await queryRunner.dropForeignKey('product', location_fk);
    }
    await queryRunner.dropTable('product');
  }
}
