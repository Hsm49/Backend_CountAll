import { Table, Column, Model, DataType, ForeignKey, Default } from 'sequelize-typescript';
import Etapa from './Etapa.model';

@Table({
    tableName: 'tarea'
})
class Tarea extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id_tarea: number;

    @Column({
        type: DataType.STRING(256)
    })
    nombre_tarea: string;

    @Column({
        type: DataType.STRING(256)
    })
    descr_tarea: string;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_inicio_tarea: Date;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_fin_tarea: Date;

    @Default('En espera')
    @Column({
        type: DataType.STRING(256)
    })
    estado_tarea: string;

    @ForeignKey(() => Etapa)
    @Column({
        type: DataType.INTEGER
    })
    id_etapa_fk_tarea: number;
}

export default Tarea;
