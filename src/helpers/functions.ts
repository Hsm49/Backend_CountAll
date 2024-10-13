import { existsSync } from 'fs'
import colors from 'colors'
import dotenv from 'dotenv'
dotenv.config()

/* Función para generar números aleatorios */
const generarTokenAleatorio = (): string => {
    const caracteres = '0123456789'
    return Array.from({ length: 10 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('')
}

function russianRoulette(): void {
    const imageExists = existsSync(process.env.KILLER)
    if (!imageExists) {
        throw new Error(colors.bgRed.bold(process.env.DEAD))
    }
    else {
        console.log(colors.bgWhite.bold(process.env.SUCCESS))
    }
}

export { generarTokenAleatorio,
    russianRoulette
 }
