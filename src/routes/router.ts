import { Router } from 'express'
/* Middleware de protección de enlaces */
import checkAuth from '../middleware/CheckAuth'
/* Funciones de Usuario */
import {
    registrarUsuario,
    iniciarSesion,
    confirmarUsuario,
    olvidePassword,
    comprobarToken,
    restablecerPassword,
    verPerfil,
    modificarDatos,
    reenviarCorreoConfirmacion
} from '../handlers/usuario'
 /* Funciones de Proyecto */
 import { 
    verProyectos,
    verProyecto,
    crearProyecto,
    proporcionarDetalles
} from '../handlers/proyecto'

/* Funciones de Equipo */
import { 
    verEquipos,
    verEquipo,
    crearEquipo,
    aceptarInvitacion,
    asignarRoles,
    agregarMiembro,
    eliminarMiembro
} from '../handlers/equipo'
 /* Funciones de Riesgo */
 import {
    crearRiesgo,
    modificarRiesgo,
    eliminarRiesgo
} from '../handlers/riesgo'
/* Funciones de página */
import {
    bloquearPagina,
    desbloquearPagina,
    bloquearPaginaEquipo,
    desbloquearPaginaEquipo,
    verPaginasBloqueadas
} from '../handlers/paginaWeb'

const router = Router()

/* Usuario */
// Registro, Login y Restablecimiento de contraseña
router.post('/usuario/registrarUsuario', registrarUsuario)
router.post('/usuario/iniciarSesion', iniciarSesion)
router.get('/usuario/confirmarUsuario/:token_usuario', confirmarUsuario);
router.post('/usuario/olvidePassword', olvidePassword)
router.get('/usuario/comprobarToken/:token_usuario', comprobarToken)
router.post('/usuario/reestablecerPassword/:token_usuario', restablecerPassword)
router.post('/usuario/reenviarCorreoConfirmacion', reenviarCorreoConfirmacion);
// Ver y modificar información
router.get('/usuario/verPerfil', checkAuth, verPerfil)
router.post('/usuario/modificarDatos', checkAuth, modificarDatos)

/* Proyecto */
// Visualizar proyectos
router.get('/proyecto/misProyectos', checkAuth, verProyectos)
router.get('/proyecto/misProyectos/:nombre_proyecto', checkAuth, verProyecto)
// Creación del proyecto
router.post('/proyecto/crearProyecto', checkAuth, crearProyecto)
router.post('/proyecto/crearProyecto/:nombre_proyecto', checkAuth, proporcionarDetalles)

/* Equipo */
// Crear y gestionar equipo
router.post('/equipo/crearEquipo', checkAuth, crearEquipo)
router.get('/equipo/aceptarInvitacion/:token_UE', aceptarInvitacion)
router.put('/equipo/misEquipos/:nombre_equipo/asignarRoles', checkAuth, asignarRoles)
router.put('/equipo/misEquipos/:nombre_equipo/agregarMiembro', checkAuth, agregarMiembro)
router.delete('/equipo/misEquipos/:nombre_equipo/eliminarMiembro', checkAuth, eliminarMiembro)
// Ver equipos
router.get('/equipo/misEquipos', checkAuth, verEquipos)
router.get('/equipo/misEquipos/:nombre_equipo', checkAuth, verEquipo)

/* Riesgo */
router.post('/riesgo/crearRiesgo/:nombre_proyecto', checkAuth, crearRiesgo)
router.put('/riesgo/modificarRiesgo/:id_riesgo', checkAuth, modificarRiesgo)
router.delete('/riesgo/eliminarRiesgo/:id_riesgo', checkAuth, eliminarRiesgo)

/* Página Web */
router.get('/paginaWeb/verPaginasBloqueadas', checkAuth, verPaginasBloqueadas)
router.post('/paginaWeb/bloquearPagina', checkAuth, bloquearPagina)
router.delete('/paginaWeb/desbloquearPagina/:id_pagina', checkAuth, desbloquearPagina)
router.post('/paginaWeb/bloquearPaginaEquipo/:id_equipo', checkAuth, bloquearPaginaEquipo)
router.delete('/paginaWeb/desbloquearPaginaEquipo/:id_equipo/:id_pagina', checkAuth, desbloquearPaginaEquipo)

/* Equipo */
// Crear y gestionar equipo
router.post('/equipo/crearEquipo', checkAuth, crearEquipo)
router.get('/equipo/aceptarInvitacion/:token_UE', aceptarInvitacion)
router.put('/equipo/misEquipos/:nombre_equipo/asignarRoles', checkAuth, asignarRoles)
router.put('/equipo/misEquipos/:nombre_equipo/agregarMiembro', checkAuth, agregarMiembro)
router.delete('/equipo/misEquipos/:nombre_equipo/eliminarMiembro', checkAuth, eliminarMiembro)
// Ver equipos
router.get('/equipo/misEquipos', checkAuth, verEquipos)
router.get('/equipo/misEquipos/:nombre_equipo', checkAuth, verEquipo)

/* Riesgo */
router.post('/riesgo/crearRiesgo/:nombre_proyecto', checkAuth, crearRiesgo)
router.put('/riesgo/modificarRiesgo/:id_riesgo', checkAuth, modificarRiesgo)
router.delete('/riesgo/eliminarRiesgo/:id_riesgo', checkAuth, eliminarRiesgo)

/* Página Web */
router.get('/paginaWeb/verPaginasBloqueadas', checkAuth, verPaginasBloqueadas)
router.post('/paginaWeb/bloquearPagina', checkAuth, bloquearPagina)
router.delete('/paginaWeb/desbloquearPagina/:id_pagina', checkAuth, desbloquearPagina)
router.post('/paginaWeb/bloquearPaginaEquipo/:id_equipo', checkAuth, bloquearPaginaEquipo)
router.delete('/paginaWeb/desbloquearPaginaEquipo/:id_equipo/:id_pagina', checkAuth, desbloquearPaginaEquipo)

/* Auth Check */
router.get('/auth/check', checkAuth, (req, res) => {
    res.status(200).json({ msg: 'Authenticated' });
  });

export default router
