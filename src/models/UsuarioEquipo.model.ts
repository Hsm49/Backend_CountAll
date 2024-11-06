import { Table, Column, Model, DataType, ForeignKey, Default, PrimaryKey } from 'sequelize-typescript';
import Usuario from './Usuario.model';
import Equipo from './Equipo.model';

@Table({
    tableName: 'usuario_equipo'
})
class UsuarioEquipo extends Model {
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_integracion_UE: Date;

    @Default('Sin definir')
    @Column({
        type: DataType.STRING(256)
    })
    rol: string;

    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER
    })
    id_usuario_fk_UE: number;

    @PrimaryKey
    @ForeignKey(() => Equipo)
    @Column({
        type: DataType.INTEGER
    })
    id_equipo_fk_UE: number;
}

export default UsuarioEquipo;
