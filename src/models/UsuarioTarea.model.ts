import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import Usuario from './Usuario.model';
import Tarea from './Tarea.model';

@Table({
    tableName: 'usuario_tarea'
})
class UsuarioTarea extends Model {
    @Column({
        type: DataType.DATE
    })
    fecha_asignacion: Date;

    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER
    })
    id_usuario_fk_UT: number;

    @PrimaryKey
    @ForeignKey(() => Tarea)
    @Column({
        type: DataType.INTEGER
    })
    id_tarea_fk_UT: number;
}

export default UsuarioTarea;
