import { Router } from 'express'
import { registrarUsuario } from '../handlers/usuario'

const router = Router()

/* Usuario */
router.post('/usuario/registrarUsuario', registrarUsuario)

export default router
