import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Usuario from './Usuario.model';
import Equipo from './Equipo.model';

@Table({
    tableName: 'usuario_equipo'
})
class UsuarioEquipo extends Model {
    @Column({
        type: DataType.DATE
    })
    fecha_integracion_UE: Date;

    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER
    })
    id_usuario_fk_UE: number;

    @ForeignKey(() => Equipo)
    @Column({
        type: DataType.INTEGER
    })
    id_equipo_fk_UE: number;
}

export default UsuarioEquipo;
