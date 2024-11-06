import { Table, Column, Model, ForeignKey, DataType, Default, PrimaryKey } from 'sequelize-typescript';
import Equipo from './Equipo.model';
import Proyecto from './Proyecto.model';

@Table({
    tableName: 'equipo_proyecto'
})
class EquipoProyecto extends Model {
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_integracion_EP: Date;

    @PrimaryKey
    @ForeignKey(() => Equipo)
    @Column({
        type: DataType.INTEGER
    })
    id_equipo_fk_clas: number;

    @PrimaryKey
    @ForeignKey(() => Proyecto)
    @Column({
        type: DataType.INTEGER
    })
    id_proyecto_fk_clas: number;
}

export default EquipoProyecto;
