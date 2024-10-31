import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsToMany, Default } from 'sequelize-typescript';
import Etapa from './Etapa.model';
import Equipo from './Equipo.model';
import EquipoProyecto from './EquipoProyecto.model';
import Usuario from './Usuario.model';

@Table({
    tableName: 'proyecto'
})
class Proyecto extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id_proyecto: number;

    @Column({
        type: DataType.STRING(256)
    })
    nombre_proyecto: string;

    @Column({
        type: DataType.STRING(256)
    })
    descr_proyecto: string;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_inicio_proyecto: Date;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    fecha_fin_proyecto: Date;

    @Default('')
    @Column({
        type: DataType.STRING(256)
    })
    estado_proyecto: string;

    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER
    })
    id_usuario_fk_proyecto: number;

    @HasMany(() => Etapa)
    etapas: Etapa[];

    @BelongsToMany(() => Equipo, () => EquipoProyecto)
    equipos: Equipo[];
}

export default Proyecto;
