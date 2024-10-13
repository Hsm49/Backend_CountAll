import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import Etapa from './Etapa.model';
import Equipo from './Equipo.model';
import EquipoProyecto from './EquipoProyecto.model';

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

    @Column({
        type: DataType.DATE
    })
    fecha_inicio_proyecto: Date;

    @Column({
        type: DataType.DATE
    })
    fecha_fin_proyecto: Date;

    @Column({
        type: DataType.STRING(256)
    })
    estado_proyecto: string;

    @HasMany(() => Etapa)
    etapas: Etapa[];

    @BelongsToMany(() => Equipo, () => EquipoProyecto)
    equipos: Equipo[];
}

export default Proyecto;
