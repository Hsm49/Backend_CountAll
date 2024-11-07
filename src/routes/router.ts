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
    reenviarCorreoConfirmacion
 } from '../handlers/usuario'
 /* Funciones de Proyecto */
 import { 
    verProyectos,
    verProyecto,
    crearProyecto,
    proporcionarDetalles
} from '../handlers/proyecto'
/* Funciones para Clasificación */
import {
    getClasificaciones
} from '../handlers/clasificacion';

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

/* Proyecto */
// Visualizar proyectos
router.get('/proyecto/misProyectos', checkAuth, verProyectos)
router.get('/proyecto/misProyectos/:nombre_proyecto', checkAuth, verProyecto)
// Creación del proyecto
router.post('/proyecto/crearProyecto', checkAuth, crearProyecto)
router.post('/proyecto/crearProyecto/:nombre_proyecto', checkAuth, proporcionarDetalles)

/* Clasificación */
// Visualizar clasificaciones
router.get('/clasificaciones', checkAuth, getClasificaciones);

/* Auth Check */
router.get('/auth/check', checkAuth, (req, res) => {
    res.status(200).json({ msg: 'Authenticated' });
  });

export default router
