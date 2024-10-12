import { Router } from 'express'
/* Funciones de Usuario */
import { registrarUsuario,
    iniciarSesion,
    confirmarUsuario,
    olvidePassword,
    comprobarToken,
    restablecerPassword
 } from '../handlers/usuario'

const router = Router()

/* Usuario */
// Registro, Login y Restablecimiento de contraseña
router.post('/usuario/registrarUsuario', registrarUsuario)
router.post('/usuario/iniciarSesion', iniciarSesion)
router.get("/usuario/confirmarUsuario/:token_usuario", confirmarUsuario);
router.post("/usuario/olvidePassword", olvidePassword)
router.get("/usuario/comprobarToken/:token_usuario", comprobarToken)
router.post("/usuario/reestablecerPassword/:token_usuario", restablecerPassword)

export default router
