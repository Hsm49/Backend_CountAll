import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import Usuario from './Usuario.model';
import Equipo from './Equipo.model';

@Table({
    tableName: 'clasificacion'
})
class Clasificacion extends Model {
    @Column({
        type: DataType.DOUBLE
    })
    puntuacion: number;

    @Column({
        type: DataType.DATE
    })
    fecha_inicio_clas: Date;

    @Column({
        type: DataType.DATE
    })
    fecha_fin_clas: Date;

    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER
    })
    id_usuario_fk_clas: number;

    @PrimaryKey
    @ForeignKey(() => Equipo)
    @Column({
        type: DataType.INTEGER
    })
    id_equipo_fk_clas: number;
}

export default Clasificacion;
