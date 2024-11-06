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
    restablecerPassword
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

const router = Router()

/* Usuario */
// Registro, Login y Restablecimiento de contraseña
router.post('/usuario/registrarUsuario', registrarUsuario)
router.post('/usuario/iniciarSesion', iniciarSesion)
router.get('/usuario/confirmarUsuario/:token_usuario', confirmarUsuario);
router.post('/usuario/olvidePassword', olvidePassword)
router.get('/usuario/comprobarToken/:token_usuario', comprobarToken)
router.post('/usuario/reestablecerPassword/:token_usuario', restablecerPassword)

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
router.get('equipo/aceptarInvitacion/:token_UE', checkAuth, aceptarInvitacion)
router.put('/equipo/misEquipos/:nombre_equipo/asignarRoles', checkAuth, asignarRoles)
router.put('/equipo/misEquipos/:nombre_equipo/agregarMiembro', checkAuth, agregarMiembro)
router.delete('/equipo/misEquipos/:nombre_equipo/eliminarMiembro', checkAuth, eliminarMiembro)
/* Ver equipos */
router.get('/equipo/misEquipos', checkAuth, verEquipos)
router.get('/equipo/misEquipos/:nombre_equipo', checkAuth, verEquipo)

export default router
