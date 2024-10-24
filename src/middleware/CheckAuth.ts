import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.model";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extraer el token del encabezado Authorization
            token = req.headers.authorization.split(" ")[1];

            // Decodificar el token con la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar al usuario por ID (Primary Key) usando Sequelize
            const usuario = await Usuario.findByPk(decoded.id, {
                attributes: { exclude: ['password'] } // Excluir el campo password
            });

            // Si el usuario no es encontrado
            if (!usuario) {
                return res.status(404).json({ msg: "Usuario no encontrado." });
            }

            // Adjuntar la información del usuario a la request
            req.usuario = usuario;

            // Continuar con el siguiente middleware/controlador
            return next();

        } catch (error) {
            // Si ocurre un error (token inválido o expirado)
            return res.status(401).json({ msg: "Token inválido o sesión expirada." });
        }
    }

    // Si no se proporciona el token
    if (!token) {
        return res.status(401).json({ msg: "No se proporcionó un token." });
    }
};

export default checkAuth;
