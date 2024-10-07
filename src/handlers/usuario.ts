// import { Request, Response } from "express"
import { check, validationResult } from 'express-validator'
import Usuario from "../models/Usuario.model"

const registrarUsuario = async (req, res) => {
    // Validación de datos vacíos
    await check('nombre_usuario').notEmpty().withMessage('Nombre de usuario vacío').run(req)
    await check('email_usuario').notEmpty().withMessage('Correo electrónico vacío').isEmail().withMessage('Correo electrónico no válido').run(req)
    await check('password_usuario').notEmpty().withMessage('Contraseña vacía').run(req)

    // Manejo de errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Verificar si el correo electrónico ya existe
    const existingUser = await Usuario.findOne({ where: { email_usuario: req.body.email_usuario } })
    if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'El correo electrónico ya está en uso' }] })
    }

    // Agregar al usuario a la BD
    try {
        const usuario = await Usuario.create(req.body)
        res.json({ data: usuario })
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' })
    }
}

export { registrarUsuario }
