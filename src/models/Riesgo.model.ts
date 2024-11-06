import { Table, Column, Model, DataType, ForeignKey, Default } from 'sequelize-typescript';
import Proyecto from './Proyecto.model';

@Table({
    tableName: 'riesgo'
})
class Riesgo extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id_riesgo: number;

    @Column({
        type: DataType.STRING(256)
    })
    nombre_riesgo: string;

    @Column({
        type: DataType.STRING(256)
    })
    descr_riesgo: string;

    @Default(50)
    @Column({
        type: DataType.INTEGER
    })
    prob_riesgo: number;

    @ForeignKey(() => Proyecto)
    @Column({
        type: DataType.INTEGER
    })
    id_riesgo_fk_proyecto: number;
}

export default Riesgo;
