import { check, validationResult } from 'express-validator'
import Proyecto from '../models/Proyecto.model'
import Usuario from '../models/Usuario.model'

const verProyectos = async(req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Retornamos proyectos del usuario
    try {
        // Buscamos los proyectos
        const proyectos_usuario = await Proyecto.findAll({
            where: { id_usuario_fk_proyecto: usuario.dataValues.id_usuario },
            attributes: ['nombre_proyecto', 'descr_proyecto']
        })

        // Verificamos que sí haya proyectos
        if (proyectos_usuario.length === 0) {
            return res.status(404).json({ message: 'No se encontraron proyectos para este usuario' })
        }

        // Enviamos la lista de proyectos en la respuesta
        res.json({
            proyectos_usuario: proyectos_usuario
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al mostrar los proyectos' })
    }
}

const verProyecto = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Retornamos información de un proyecto
    const { nombre_proyecto } = req.params
    try {
        // Buscamos el proyecto
        const proyectoEncontrado = await Proyecto.findOne({
            where: { nombre_proyecto: nombre_proyecto },
            attributes: ['nombre_proyecto', 'descr_proyecto', 'fecha_inicio_proyecto', 'fecha_fin_proyecto', 'estado_proyecto']  // Only fetch the ID
        })

        // Verificamos que se haya encontrado un proyecto y lo enviamos de vuelta
        if (proyectoEncontrado) {
            res.json({
                proyecto: proyectoEncontrado
            })
        }
        else {
            res.status(500).json({ error: 'No existe este proyecto' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al mostrar este proyecto' })
    }
}

const crearProyecto = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
    await check('nombre_proyecto').notEmpty().withMessage('Nombre de proyecto vacío').run(req)
    await check('descr_proyecto').notEmpty().withMessage('Descripción de proyecto vacía').run(req)

    // Manejo de errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Creamos el proyecto
    try {
        // Obtenemos el ID del usuario mediante su email
        const usuarioEncontrado = await Usuario.findOne({
            where: { email_usuario: usuario.dataValues.email_usuario },
            attributes: ['id_usuario']  // Only fetch the ID
        })

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // Creación del proyecto con el ID del usuario
        const proyectoData = {
            ...req.body,
            id_usuario_fk_proyecto: usuarioEncontrado.dataValues.id_usuario
        }

        await Proyecto.create(proyectoData)

        // Enviar respuesta exitosa
        res.json({
            msg: 'Se ha creado el proyecto'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear proyecto' })
    }
}

const proporcionarDetalles = async (req, res) => {
    // Verify that there is an active session
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Data integrity validation
    await check('fecha_inicio_proyecto')
        .notEmpty().withMessage('Fecha de inicio del proyecto vacía')
        .isISO8601().withMessage('Fecha requerida')
        .run(req)
    await check('fecha_fin_proyecto')
        .notEmpty().withMessage('Fecha de finalización del proyecto vacía')
        .isISO8601().withMessage('Fecha requerida')
        .run(req)
    await check('estado_proyecto')
        .notEmpty().withMessage('Estado de proyecto vacío')
        .run(req)

    // Error handling
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Finalize project configuration
    const { nombre_proyecto } = req.params
    const { fecha_inicio_proyecto, fecha_fin_proyecto, estado_proyecto } = req.body

    try {
        // Find the project to update
        const proyectoEncontrado = await Proyecto.findOne({
            where: { nombre_proyecto },
        })

        if (proyectoEncontrado) {
            await Proyecto.update(
                {
                    fecha_inicio_proyecto,
                    fecha_fin_proyecto,
                    estado_proyecto
                },
                { where: { nombre_proyecto } }
            )

            // Send success response
            return res.json({
                msg: 'Se ha concluido la creación del proyecto'
            })
        } else {
            return res.status(404).json({ error: 'No existe este proyecto' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear proyecto' })
    }
}

export {
    verProyectos,
    verProyecto,
    crearProyecto,
    proporcionarDetalles
}
