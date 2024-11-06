import { check, validationResult } from 'express-validator'
import { emailEquipos } from '../helpers/emails'
import Equipo from '../models/Equipo.model'
import Proyecto from '../models/Proyecto.model'
import Usuario from '../models/Usuario.model'
import EquipoProyecto from '../models/EquipoProyecto.model'
import UsuarioEquipo from '../models/UsuarioEquipo.model'

const verEquipos = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Retornamos equipos del usuario UsuarioEquipo
    try {
        // Buscamos los equipos en la tabla 
        const equipos_usuario_keys = await UsuarioEquipo.findAll({
            where: { id_usuario_fk_UE: usuario.dataValues.id_usuario },
            attributes: ['id_equipo_fk_UE']
        })

        // Verificamos que sí haya equipos
        if (equipos_usuario_keys.length === 0) {
            return res.status(404).json({ message: 'No se encontraron equipos para este usuario' })
        }

        // Recuperamos la información de los equipos
        let equipos_usuario = []
        try {
            for (const equipo of equipos_usuario_keys) {
                const equipoEncontrado = await Equipo.findOne({
                    where: { id_equipo: equipo.dataValues.id_equipo_fk_UE },
                    attributes: ['nombre_equipo', 'descr_equipo']
                })
                equipos_usuario.push(equipoEncontrado)
            }

            // Enviamos la lista de proyectos en la respuesta
            res.json({
                equipos_usuario: equipos_usuario
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un problema al recuperar información de los equipos' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al mostrar los equipos' })
    }
}

const verEquipo = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Retornamos información de un equipo
    const { nombre_equipo } = req.params
    try {
        // Encontramos al equipo
        const equipoEncontrado = await Equipo.findOne({
            where: { nombre_equipo: nombre_equipo },
            attributes: ['id_equipo', 'nombre_equipo', 'descr_equipo']
        })

        // Encontramos usuarios y roles relacionados con el equipo
        let usuariosRoles = await UsuarioEquipo.findAll({
            where: { id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo },
            attributes: ['id_usuario_fk_UE', 'rol']
        })
        // Encontramos los nombres de los usuarios
        let usuarios = []
        for (const usuario of usuariosRoles) {
            const usuarioEncontrado = await Usuario.findOne({
                where: { id_usuario: usuario.dataValues.id_usuario_fk_UE },
                attributes: ['nombre_usuario', 'email_usuario']
            })
            usuarios.push(usuarioEncontrado)
        }

        // Conjuntamos la información de los usuarios
        let infoEquipo = {
            id_equipo: equipoEncontrado.dataValues.id_equipo,
            nombre_equipo: equipoEncontrado.dataValues.nombre_equipo,
            descr_equipo: equipoEncontrado.dataValues.descr_equipo,
            integrantes_equipo: []
        }
        for (let index = 0; index < usuarios.length; index++) {
            const integrante = {
                nombre_usuario: usuarios[index].dataValues.nombre_usuario,
                id_usuario: usuariosRoles[index].dataValues.id_usuario_fk_UE,
                email_usuario: usuarios[index].dataValues.email_usuario,
                rol: usuariosRoles[index].dataValues.rol
            }
            infoEquipo.integrantes_equipo.push(integrante)
        }

        // Enviamos la información del equipo como respuesta
        res.json({
            equipo: infoEquipo
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema al recuperar información de este equipo' })
    }
}

const crearEquipo = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
    await check('nombre_equipo').notEmpty().withMessage('Nombre de equipo vacío').run(req)
    await check('descr_equipo').notEmpty().withMessage('Descripción de equipo vacía').run(req)
    await check('usuarios').notEmpty().withMessage('Lista de usuarios vacía').run(req)
    await check('proyecto').notEmpty().withMessage('Nombre de proyecto vacío').run(req)

    // Manejo de errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Creamos el equipo
    try {
        // Obtenemos el Id del proyecto
        const proyectoEncontrado = await Proyecto.findOne({
            where: { nombre_proyecto: req.body.proyecto },
            attributes: ['id_proyecto', 'nombre_proyecto']
        })
        
        if (!proyectoEncontrado) {
            return res.status(404).json({ error: 'Proyecto no encontrado' })
        }

        // Obtenemos Id's & emails de todos los usuarios
        let usuarios = []
        // Del usuario creador del equipo
        const nombre = usuario.dataValues.nombre_usuario
        const usuarioEncontrado = await Usuario.findOne({
            where: { nombre_usuario: nombre },
            attributes: ['id_usuario', 'nombre_usuario', 'email_usuario']
        })
        usuarios.push(usuarioEncontrado)
        // De los demás usuarios
        for (const nombre_usuario of req.body.usuarios) {
            const usuarioEncontrado = await Usuario.findOne({
                where: { nombre_usuario },
                attributes: ['id_usuario', 'nombre_usuario', 'email_usuario']
            })
            
            if (!usuarioEncontrado) {
                return res.status(404).json({ error: `Este usuario no existe: ${nombre_usuario}` })
            }
            usuarios.push(usuarioEncontrado)
        }

        // Estructura y creación del equipo
        const equipoData = {
            nombre_equipo: req.body.nombre_equipo,
            descr_equipo: req.body.descr_equipo,
        }
        const equipoCreado = await Equipo.create(equipoData)
        
        // Estructura y creación de los campos en la tabla EquipoProyecto
        const equipoProyectoData = {
            id_equipo_fk_clas: equipoCreado.dataValues.id_equipo,
            id_proyecto_fk_clas: proyectoEncontrado.dataValues.id_proyecto
        }
        await EquipoProyecto.create(equipoProyectoData)

        // Estructura y creación de los campos en la tabla UsuarioEquipo
        let usuarioEquipoData = {}
        // Definimos al creador del equipo como líder
        usuarioEquipoData = {
            rol: 'Líder',
            id_usuario_fk_UE: usuario.dataValues.id_usuario,
            id_equipo_fk_UE: equipoCreado.dataValues.id_equipo
        }
        await UsuarioEquipo.create(usuarioEquipoData)
        for (const usuario of usuarios.slice(1)) {
            usuarioEquipoData = {
                id_usuario_fk_UE: usuario.dataValues.id_usuario,
                id_equipo_fk_UE: equipoCreado.dataValues.id_equipo
            }
            await UsuarioEquipo.create(usuarioEquipoData)
        }

        // Enviamos un correo a los usuarios restantes
        const nombre_lider = req.usuario.dataValues.nombre_usuario
        const email_lider = req.usuario.dataValues.email_usuario
        for (const usuario of usuarios.slice(1)) {
            try {
                // Envío del correo de confirmación
                await emailEquipos({
                    email_usuario: usuario.dataValues.email_usuario,
                    nombre_integrante: usuario.dataValues.nombre_usuario,
                    nombre_lider: nombre_lider,
                    email_lider: email_lider,
                    nombre_equipo: equipoCreado.dataValues.nombre_equipo, 
                    nombre_proyecto: proyectoEncontrado.dataValues.nombre_proyecto
                });
            } catch (error) {
                res.status(500).json({ error: 'Hubo un error al enviar el correo de integración de los equipos' })
            }
        }

        // Enviamos respuesta exitosa
        res.json({
            msg: 'Se ha creado el equipo y notificado a los miembros'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear equipo' })
    }
}

const asignarRoles = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
    await check('nombre_usuario').notEmpty().withMessage('Nombre de usuario vacío').run(req)
    await check('rol').notEmpty().withMessage('Campo de rol vacío').run(req)

    // Retornamos información de un equipo
    const { nombre_equipo } = req.params
    try {
        // Encontramos al equipo
        const equipoEncontrado = await Equipo.findOne({
            where: { nombre_equipo: nombre_equipo },
            attributes: ['id_equipo', 'nombre_equipo', 'descr_equipo']
        })
        if (!equipoEncontrado) {
            return res.status(500).json({ error: 'Este equipo no existe' })
        }

        // Verificamos que el usuario se encuentre en el equipo
        const usuarioEncontrado = await Usuario.findOne({
            where: { nombre_usuario: req.body.nombre_usuario },
            attributes: ['id_usuario', 'nombre_usuario', 'email_usuario']
        })
        if (!usuarioEncontrado) {
            return res.status(500).json({ error: 'Este usuario no existe' })
        }
        const existeEnEquipo = await UsuarioEquipo.findOne({
            where: { id_usuario_fk_UE: usuarioEncontrado.dataValues.id_usuario },
            attributes: ['id_usuario_fk_UE', 'rol']
        })
        if (!existeEnEquipo) {
            return res.status(500).json({ error: 'Este usuario no está en el equipo' })
        }

        // Modificamos el rol del integrante
        await UsuarioEquipo.update(
            { rol: req.body.rol },
            { where: { id_usuario_fk_UE: existeEnEquipo.dataValues.id_usuario_fk_UE, id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo } }
        )

        // Enviamos respuesta exitosa
        res.json({
            msg: 'Se ha actualizado el rol del integrante'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al modificar el rol' })
    }
}

const agregarMiembro = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
    await check('nombre_usuario').notEmpty().withMessage('Nombre de usuario vacío').run(req)

    // Manejo de errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // Encontramos el equipo
        const equipoEncontrado = await Equipo.findOne({
            where: { nombre_equipo: req.params.nombre_equipo },
            attributes: ['id_equipo', 'nombre_equipo']
        })
        if (!equipoEncontrado) {
            return res.status(404).json({ error: 'Equipo no encontrado' })
        }

        // Verificamos la existencia del usuario
        const usuarioEncontrado = await Usuario.findOne({
            where: { nombre_usuario: req.body.nombre_usuario },
            attributes: ['id_usuario', 'nombre_usuario', 'email_usuario']
        })
        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // Verificamos si el usuario ya está en el equipo
        const miembroExistente = await UsuarioEquipo.findOne({
            where: {
                id_usuario_fk_UE: usuarioEncontrado.dataValues.id_usuario,
                id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo
            }
        })
        if (miembroExistente) {
            return res.status(400).json({ error: 'El usuario ya es miembro del equipo' })
        }

        // Añadimos el usuario al equipo
        await UsuarioEquipo.create({
            id_usuario_fk_UE: usuarioEncontrado.dataValues.id_usuario,
            id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo
        })

        res.json({ msg: 'El miembro ha sido agregado al equipo' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al agregar el miembro al equipo' })
    }
}


const eliminarMiembro = async (req, res) => {
    // Verificamos una sesión iniciada
    const usuario = req.usuario
    if (!usuario) {
        return res.status(500).json({ error: 'No hay sesión iniciada' })
    }

    // Validación de la integridad de los datos
    await check('nombre_usuario').notEmpty().withMessage('Nombre de usuario vacío').run(req)

    // Manejo de errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // Encontramos el equipo
        const equipoEncontrado = await Equipo.findOne({
            where: { nombre_equipo: req.params.nombre_equipo },
            attributes: ['id_equipo', 'nombre_equipo']
        })
        if (!equipoEncontrado) {
            return res.status(404).json({ error: 'Equipo no encontrado' })
        }

        // Encontramos al usuario
        const usuarioEncontrado = await Usuario.findOne({
            where: { nombre_usuario: req.body.nombre_usuario },
            attributes: ['id_usuario', 'nombre_usuario']
        })
        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // Verificamos si el usuario pertenece al equipo
        const miembroExistente = await UsuarioEquipo.findOne({
            where: {
                id_usuario_fk_UE: usuarioEncontrado.dataValues.id_usuario,
                id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo
            }
        })
        if (!miembroExistente) {
            return res.status(400).json({ error: 'El usuario no es miembro del equipo' })
        }

        // Eliminamos al usuario del equipo
        await UsuarioEquipo.destroy({
            where: {
                id_usuario_fk_UE: usuarioEncontrado.dataValues.id_usuario,
                id_equipo_fk_UE: equipoEncontrado.dataValues.id_equipo
            }
        })

        res.json({ msg: 'El miembro ha sido eliminado del equipo' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al eliminar el miembro del equipo' })
    }
}


export {
    verEquipos,
    verEquipo,
    crearEquipo,
    asignarRoles,
    agregarMiembro,
    eliminarMiembro
}
