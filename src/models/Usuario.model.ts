import {Table, Column, Model, DataType, Default } from 'sequelize-typescript'
import { generarTokenAleatorio } from '../helpers/functions'

@Table({
    tableName: 'usuario'
})

class Usuario extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    nombre_usuario: string

    @Column({
        type: DataType.STRING(100)
    })
    email_usuario: string

    @Column({
        type: DataType.STRING(100)
    })
    password_usuario: string

    @Default(0)
    @Column({
        type: DataType.INTEGER()
    })
    acumulado_usuario: number

    @Default(generarTokenAleatorio)
    @Column({
        type: DataType.STRING(10)
    })
    token_usuario: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    is_confirmed: boolean
}

export default Usuario
