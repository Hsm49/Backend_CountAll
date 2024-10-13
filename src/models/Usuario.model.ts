import { Table, Column, Model, DataType, HasMany, Default, AutoIncrement } from 'sequelize-typescript';
import { generarTokenAleatorio } from '../helpers/functions'
import UsuarioEquipo from './UsuarioEquipo.model';
import UsuarioTarea from './UsuarioTarea.model';
import UsuarioRecompensa from './UsuarioRecompensa.model';
import Clasificacion from './Clasificacion.model';

@Table({
    tableName: 'usuario'
})
class Usuario extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id_usuario: number;

    @Column({
        type: DataType.STRING(256)
    })
    nombre_usuario: string;

    @Column({
        type: DataType.STRING(256)
    })
    email_usuario: string;

    @Column({
        type: DataType.STRING(256)
    })
    password_usuario: string;

    @Default(generarTokenAleatorio)
    @Column({
        type: DataType.STRING(10)
    })
    token_usuario: string

    @Default(0)
    @Column({
        type: DataType.INTEGER
    })
    puntuacion_global: number

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    is_confirmed: boolean

    @HasMany(() => UsuarioEquipo)
    usuarioEquipos: UsuarioEquipo[];

    @HasMany(() => UsuarioTarea)
    usuarioTareas: UsuarioTarea[];

    @HasMany(() => UsuarioRecompensa)
    usuarioRecompensas: UsuarioRecompensa[];

    @HasMany(() => Clasificacion)
    clasificaciones: Clasificacion[];
}

export default Usuario;
