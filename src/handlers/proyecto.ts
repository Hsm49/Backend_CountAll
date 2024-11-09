import { check, validationResult } from 'express-validator'
import Proyecto from '../models/Proyecto.model'
import Usuario from '../models/Usuario.model'
import Etapa from '../models/Etapa.model'
import Tarea from '../models/Tarea.model'
import Riesgo from '../models/Riesgo.model'

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
            attributes: ['id_proyecto', 'nombre_proyecto', 'descr_proyecto']
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
            attributes: ['id_proyecto', 'nombre_proyecto', 'descr_proyecto', 'fecha_inicio_proyecto', 'fecha_fin_proyecto', 'metodologia_proyecto', 'estado_proyecto']
        })

        // Obtenemos todos los riesgos asociados al proyecto
        const riesgosProyecto = await Riesgo.findAll({
            where: { id_riesgo_fk_proyecto: proyectoEncontrado.dataValues.id_proyecto },
            attributes: ['id_riesgo', 'nombre_riesgo', 'descr_riesgo', 'prob_riesgo']
        })

        // Verificamos que se haya encontrado un proyecto y lo enviamos de vuelta
        if (proyectoEncontrado) {
            res.json({
                proyecto: proyectoEncontrado,
                riesgos_proyecto: riesgosProyecto
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

    const existingProyect = await Proyecto.findOne({ where: { nombre_proyecto: req.body.nombre_proyecto } })
    if (existingProyect) {
        return res.status(500).json({ error: 'Este proyecto ya existe' })
    }

    // Creamos el proyecto
    try {
        // Obtenemos el ID del usuario mediante su email
        const usuarioEncontrado = await Usuario.findOne({
            where: { email_usuario: usuario.dataValues.email_usuario },
            attributes: ['id_usuario']
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
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
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
    await check('metodologia_proyecto')
        .notEmpty().withMessage('Metodología de proyecto vacía')
        .run(req)
    await check('numero_etapas_proyecto')
        .notEmpty().withMessage('Número de etapas de proyecto vacío')
        .run(req)

    // Manejo de errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Finalizamos la configuración del proyecto
    const { nombre_proyecto } = req.params
    const { fecha_inicio_proyecto, fecha_fin_proyecto, estado_proyecto, metodologia_proyecto, numero_etapas_proyecto } = req.body

    try {
        // Encontramos el proyecto para actualizar
        const proyectoEncontrado = await Proyecto.findOne({
            where: { nombre_proyecto },
        })

        if (proyectoEncontrado) {
            await Proyecto.update(
                {
                    fecha_inicio_proyecto,
                    fecha_fin_proyecto,
                    estado_proyecto,
                    metodologia_proyecto,
                    numero_etapas_proyecto
                },
                { where: { nombre_proyecto } }
            )

            // Creamos las etapas según la metodología propuesta
            if (metodologia_proyecto === 'Scrum') {
                // Creamos etapas y tareas iniciales
                for (let index = 0; index < numero_etapas_proyecto; index++) {
                    // Creamos una etapa
                    const etapaData = {
                        nombre_etapa: `Sprint ${index + 1} (${proyectoEncontrado.dataValues.nombre_proyecto})`,
                        descr_etapa: `Sprint número ${index + 1} del proyecto ${proyectoEncontrado.dataValues.nombre_proyecto}`,
                        id_proyecto_fk_etapa: proyectoEncontrado.dataValues.id_proyecto
                    }
                    const etapa = await Etapa.create(etapaData)
                    // Creamos tareas iniciales por Sprint
                    const tarea1Data = {
                        nombre_tarea: `Planificación del Sprint ${index + 1}`,
                        descr_tarea: `Realizar una junta para identificar los hitos a conseguir en este Sprint`,
                        id_etapa_fk_tarea: etapa.dataValues.id_etapa
                    }
                    const tarea2Data = {
                        nombre_tarea: `Actualización del backlog del Sprint ${index + 1}`,
                        descr_tarea: `Realizar una identificación de las actividades a realizar en este Sprint`,
                        id_etapa_fk_tarea: etapa.dataValues.id_etapa
                    }
                    const tarea3Data = {
                        nombre_tarea: `Evaluación con Product Owner`,
                        descr_tarea: `Junta programada para obtener retroalimenación de los productos obtenidos con el Product Owner`,
                        id_etapa_fk_tarea: etapa.dataValues.id_etapa
                    }
                    const tarea4Data = {
                        nombre_tarea: `Retrospectiva del Sprint ${index + 1}`,
                        descr_tarea: `Realizar una junta para evaluar los resultados obtenidos en este Sprint`,
                        id_etapa_fk_tarea: etapa.dataValues.id_etapa
                    }
                    await Tarea.create(tarea1Data)
                    await Tarea.create(tarea2Data)
                    await Tarea.create(tarea3Data)
                    await Tarea.create(tarea4Data)
                }
            }

            // Enviamos respuesta exitosa
            return res.json({
                msg: 'Se ha concluido la creación del proyecto, revise las etapas y tareas para personalizarlas'
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
