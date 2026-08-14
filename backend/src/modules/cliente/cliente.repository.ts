import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/shared/db';

// ── Atributos del modelo ───────────────────────────────────────────────────

export interface ClienteAttributes {
  id: number;
  tipo_doc: 'DNI' | 'CE' | 'RUC';
  num_doc: string;
  nombres: string;
  ap_paterno: string;
  ap_materno: string | null;
  email: string | null;
  telefono: string | null;
  fecha_nac: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type ClienteCreationAttributes = Optional<ClienteAttributes, 'id'>;

// ── Modelo Sequelize ───────────────────────────────────────────────────────

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes {
  declare id: number;
  declare tipo_doc: 'DNI' | 'CE' | 'RUC';
  declare num_doc: string;
  declare nombres: string;
  declare ap_paterno: string;
  declare ap_materno: string | null;
  declare email: string | null;
  declare telefono: string | null;
  declare fecha_nac: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_doc: {
      type: DataTypes.ENUM('DNI', 'CE', 'RUC'),
      allowNull: false,
    },
    num_doc: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ap_paterno: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ap_materno: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    fecha_nac: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'cliente',
    modelName: 'Cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

// ── Queries (Repository) ───────────────────────────────────────────────────

import { Op, WhereOptions, Transaction } from 'sequelize';
import { CreateClienteDto, ListClienteQuery, UpdateClienteDto } from './cliente.schema';

export const clienteRepository = {

  findAll: async (query: ListClienteQuery) => {
    const { tipo_doc, num_doc, nombre, page, limit } = query;
    const offset = (page - 1) * limit;

    const where: WhereOptions<ClienteAttributes> = {};
    if (tipo_doc) where.tipo_doc = tipo_doc;
    if (num_doc) where.num_doc = { [Op.like]: `%${num_doc}%` };
    if (nombre) {
      (where as Record<symbol, unknown>)[Op.or] = [
        { nombres: { [Op.like]: `%${nombre}%` } },
        { ap_paterno: { [Op.like]: `%${nombre}%` } },
        { ap_materno: { [Op.like]: `%${nombre}%` } },
      ];
    }

    const { rows, count } = await Cliente.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { rows, count };
  },

  findById: async (id: number) =>
    Cliente.findByPk(id),

  findByTipoAndNumDoc: async (tipo_doc: string, num_doc: string) =>
    Cliente.findOne({ where: { tipo_doc, num_doc } }),

  create: async (data: CreateClienteDto, transaction?: Transaction) =>
    Cliente.create(data, { transaction }),

  update: async (id: number, data: UpdateClienteDto) => {
    const [affectedRows] = await Cliente.update(data, { where: { id } });
    return affectedRows;
  },

  delete: async (id: number) =>
    Cliente.destroy({ where: { id } }),
};
