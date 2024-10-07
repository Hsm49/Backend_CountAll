import express from 'express'
import router from './routes/router'
import db from './config/db'
import colors from 'colors'

// Conexión a la base de datos
async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bgBlue.bold('Conexión exitosa a la BD'))
    } catch (error) {
        // console.log(error)
        console.log(colors.bgRed.bold('Hubo un error al conectar a la Base de Datos'))
    }
}

connectDB()

// Instancia de express
const server = express()

// Leer datos de formularios
server.use(express.json())

// Manejo de rutas
server.use('/api', router)

export default server
