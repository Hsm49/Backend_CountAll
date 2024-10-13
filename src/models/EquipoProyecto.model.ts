import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import Equipo from './Equipo.model';
import Proyecto from './Proyecto.model';

@Table({
    tableName: 'equipo_proyecto'
})
class EquipoProyecto extends Model {
    @Column({
        type: DataType.DATE
    })
    fecha_integracion_EP: Date;

    @ForeignKey(() => Equipo)
    @Column({
        type: DataType.INTEGER
    })
    id_equipo_fk_clas: number;

    @ForeignKey(() => Proyecto)
    @Column({
        type: DataType.INTEGER
    })
    id_proyecto_fk_clas: number;
}

export default EquipoProyecto;
