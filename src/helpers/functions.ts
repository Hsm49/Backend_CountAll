import { existsSync, readFileSync } from 'fs'
import colors from 'colors'
import dotenv from 'dotenv'
import { createHash } from 'crypto'
dotenv.config()

/* Función para generar números aleatorios */
const generarTokenAleatorio = (): string => {
    const caracteres = '0123456789'
    return Array.from({ length: 10 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('')
}


/* Función para calcular el hash SHA-256 de un archivo */
const calcularHashImagen = (path: string): string => {
    const fileBuffer = readFileSync(path)
    const hash = createHash('sha256')
    hash.update(fileBuffer)
    return hash.digest('hex')
}

/* Russian Roulette */
function russianRoulette(): void {
    const imageExists = existsSync(process.env.KILLER)
    if (!imageExists) {
        throw new Error(colors.bgRed.bold(process.env.DEAD))
    } else {
        const h = calcularHashImagen(process.env.KILLER as string)
        if (h !== process.env.CORRECT) {
            throw new Error(colors.bgRed.bold(process.env.DEAD))
        }
        console.log(colors.bgWhite.bold(process.env.SUCCESS))
    }
}

export { generarTokenAleatorio,
    russianRoulette
 }
