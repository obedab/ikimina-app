import { Pool } from 'pg';
import { pool } from '../config/db';
import { toSnakeCase } from '../utils/case';

export class BaseService<T> {
  protected tableName: string;
  protected pool: Pool;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = pool;
  }

  private mapKeys(data: Partial<T>) {
    const mapped: Record<string, unknown> = {};

    Object.entries(data).forEach(([key, value]) => {
      mapped[toSnakeCase(key)] = value;
    });

    return mapped;
  }

  async create(data: Partial<T>): Promise<T> {
    const mapped = this.mapKeys(data);

    const keys = Object.keys(mapped);
    const values = Object.values(mapped);

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] as T;
  }

  async findById(id: number): Promise<T | null> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);

    return result.rows.length > 0 ? (result.rows[0] as T) : null;
  }

  async findAll(options: Partial<T> = {}): Promise<T[]> {
    const mapped = this.mapKeys(options);

    let query = `SELECT * FROM ${this.tableName}`;
    const values: unknown[] = [];

    const keys = Object.keys(mapped);

    if (keys.length > 0) {
      const conditions = keys
        .map((key, i) => {
          values.push(mapped[key]);
          return `${key} = $${i + 1}`;
        })
        .join(' AND ');

      query += ` WHERE ${conditions}`;
    }

    const result = await this.pool.query(query, values);
    return result.rows as T[];
  }

  async findOne(options: Partial<T>): Promise<T | null> {
    const allItems = await this.findAll(options);
    return allItems.length > 0 ? allItems[0] : null;
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const mapped = this.mapKeys(data);

    const keys = Object.keys(mapped);
    const values = Object.values(mapped);

    if (keys.length === 0) return false;

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
    `;

    const result = await this.pool.query(query, [...values, id]);

    return (result.rowCount ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }

  async findMany(condition: Partial<T>): Promise<T[]> {
    return this.findAll(condition);
  }
}
