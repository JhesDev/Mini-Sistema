import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/shared/db';
import { Op, WhereOptions, Transaction } from 'sequelize';
import { Cliente } from '@/modules/cliente/cliente.repository';
import { ListTramiteQuery, TramiteEstado } from './tramite.schema';

// ── Atributos ──────────────────────────────────────────────────────────────

export interface TramiteAttributes {
  id: number;
  codigo: string;
  cliente_id: number;
  placa: string | null;
  marca: string;
  modelo: string;
  anio: number;
  estado: TramiteEstado;
  monto: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type TramiteCreationAttributes = Optional<TramiteAttributes, 'id'>;

// ── Modelo Sequelize ───────────────────────────────────────────────────────

export class Tramite
  extends Model<TramiteAttributes, TramiteCreationAttributes>
  implements TramiteAttributes
{
  declare id: number;
  declare codigo: string;
  declare cliente_id: number;
  declare placa: string | null;
  declare marca: string;
  declare modelo: string;
  declare anio: number;
  declare estado: TramiteEstado;
  declare monto: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Tramite.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    cliente_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    placa: { type: DataTypes.STRING(10), allowNull: true },
    marca: { type: DataTypes.STRING(50), allowNull: false },
    modelo: { type: DataTypes.STRING(50), allowNull: false },
    anio: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.ENUM('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO'),
      allowNull: false,
      defaultValue: 'REGISTRADO',
    },

    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  },
  {
    sequelize,
    tableName: 'tramite',
    modelName: 'Tramite',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

// ── Asociaciones ───────────────────────────────────────────────────────────

Tramite.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Tramite, { foreignKey: 'cliente_id', as: 'tramites' });

// ── Helpers para generar código correlativo ────────────────────────────────

const generarCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `INM-${year}-`;
  const ultimo = await Tramite.findOne({
    where: { codigo: { [Op.like]: `${prefix}%` } },
    order: [['id', 'DESC']],
  });
  const siguiente = ultimo
    ? parseInt(ultimo.codigo.split('-').pop() ?? '0', 10) + 1
    : 1;
  return `${prefix}${String(siguiente).padStart(4, '0')}`;
};

// ── Repository ─────────────────────────────────────────────────────────────

export const tramiteRepository = {

  findAll: async (query: ListTramiteQuery) => {
    const { estado, cliente_id, fecha_desde, fecha_hasta, page, limit } = query;
    const offset = (page - 1) * limit;

    const where: WhereOptions<TramiteAttributes> = {};
    if (estado) where.estado = estado;
    if (cliente_id) where.cliente_id = cliente_id;
    if (fecha_desde || fecha_hasta) {
      where.created_at = {
        ...(fecha_desde ? { [Op.gte]: new Date(fecha_desde) } : {}),
        ...(fecha_hasta ? { [Op.lte]: new Date(`${fecha_hasta}T23:59:59`) } : {}),
      };
    }

    const { rows, count } = await Tramite.findAndCountAll({
      where,
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombres', 'ap_paterno', 'tipo_doc', 'num_doc'] }],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { rows, count };
  },

  findById: async (id: number) =>
    Tramite.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { association: 'seguimientos' },
      ],
    }),

  findByIdRaw: async (id: number) => Tramite.findByPk(id),

  nextCodigo: generarCodigo,

  create: async (data: Omit<TramiteAttributes, 'id'>, transaction?: Transaction) =>
    Tramite.create(data, { transaction }),

  update: async (id: number, data: Partial<TramiteAttributes>, transaction?: Transaction) => {
    const [affected] = await Tramite.update(data, { where: { id }, transaction });
    return affected;
  },

  delete: async (id: number, transaction?: Transaction) =>
    Tramite.destroy({ where: { id }, transaction }),

  updateEstado: async (id: number, estado: TramiteEstado, transaction?: Transaction) => {
    const [affected] = await Tramite.update({ estado }, { where: { id }, transaction });
    return affected;
  },
};
