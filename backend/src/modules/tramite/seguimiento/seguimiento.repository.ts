import { DataTypes, Model, Optional, Transaction } from 'sequelize';
import { sequelize } from '@/shared/db';
import { Tramite } from '../tramite.repository';
import { CreateSeguimientoDto, ListSeguimientoQuery } from './seguimiento.schema';
import { TramiteEstado } from '../tramite.schema';

// ── Atributos ──────────────────────────────────────────────────────────────

export interface SeguimientoAttributes {
  id: number;
  tramite_id: number;
  estado_anterior: TramiteEstado | null;
  estado_nuevo: TramiteEstado;
  comentario: string | null;
  usuario: string;
  created_at?: Date;
}

export type SeguimientoCreationAttributes = Optional<SeguimientoAttributes, 'id'>;

// ── Modelo Sequelize ───────────────────────────────────────────────────────

export class Seguimiento
  extends Model<SeguimientoAttributes, SeguimientoCreationAttributes>
  implements SeguimientoAttributes
{
  declare id: number;
  declare tramite_id: number;
  declare estado_anterior: TramiteEstado | null;
  declare estado_nuevo: TramiteEstado;
  declare comentario: string | null;
  declare usuario: string;
  declare readonly created_at: Date;
}

Seguimiento.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    tramite_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    estado_anterior: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    estado_nuevo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    comentario: { type: DataTypes.STRING(500), allowNull: true },
    usuario: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    tableName: 'tramite_seguimiento',
    modelName: 'Seguimiento',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,      // tramite_seguimiento no tiene updated_at
    underscored: true,
  },
);

// ── Asociaciones ───────────────────────────────────────────────────────────

Seguimiento.belongsTo(Tramite, { foreignKey: 'tramite_id', as: 'tramite' });
Tramite.hasMany(Seguimiento, { foreignKey: 'tramite_id', as: 'seguimientos' });

// ── Repository ─────────────────────────────────────────────────────────────

export const seguimientoRepository = {

  findByTramite: async (tramite_id: number, query: ListSeguimientoQuery) => {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const { rows, count } = await Seguimiento.findAndCountAll({
      where: { tramite_id },
      limit,
      offset,
      order: [['created_at', 'ASC']],
    });
    return { rows, count };
  },

  create: async (data: CreateSeguimientoDto, transaction?: Transaction) =>
    Seguimiento.create(data, { transaction }),
};
