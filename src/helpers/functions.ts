/* Función para generar números aleatorios */
const generarTokenAleatorio = (): string => {
    const caracteres = '0123456789'
    return Array.from({ length: 10 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('')
}

export { generarTokenAleatorio }
