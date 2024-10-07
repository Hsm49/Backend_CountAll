import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
/* Importación de los modelos */
import Usuario from '../models/Usuario.model';

dotenv.config();

// Manually define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colocar ssl=true al final de la URI
const db = new Sequelize(process.env.DB_URI!, {
    models: [path.join(__dirname, '/../models/**/*.ts')]  // Use path.join to properly form the path
});

/* Carga manual de los modelos para evitar errores */
db.addModels([Usuario])

export default db
