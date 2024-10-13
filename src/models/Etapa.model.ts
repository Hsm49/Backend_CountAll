import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Proyecto from './Proyecto.model';

@Table({
    tableName: 'etapa'
})
class Etapa extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id_etapa: number;

    @Column({
        type: DataType.STRING(256)
    })
    nombre_etapa: string;

    @Column({
        type: DataType.STRING(256)
    })
    descr_etapa: string;

    @Column({
        type: DataType.DATE
    })
    fecha_inicio_etapa: Date;

    @Column({
        type: DataType.DATE
    })
    fecha_fin_etapa: Date;

    @Column({
        type: DataType.STRING(256)
    })
    estado_etapa: string;

    @ForeignKey(() => Proyecto)
    @Column({
        type: DataType.INTEGER
    })
    id_proyecto_fk_etapa: number;
}

export default Etapa;
