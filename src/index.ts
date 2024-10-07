/* Comandos a instalar y usar para ejecutar código TS
npm i -D tsx
npx tsx src/index.ts */

import server from './server'
import colors from 'colors'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(colors.magenta.bold(`REST API corriendo en el puerto ${port}`))
})
