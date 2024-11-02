import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import Clasificacion from '../models/Clasificacion.model';
import Usuario from '../models/Usuario.model';
import Rol from '../models/Rol.model';

export const getClasificaciones = async (req, res) => {
  // Verificamos una sesión iniciada
  const usuario = req.usuario;
  if (!usuario) {
    return res.status(500).json({ error: 'No hay sesión iniciada' });
  }

  // Manejo de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Obtener clasificaciones
  try {
    const clasificaciones = await Clasificacion.findAll({
      include: [{
        model: Usuario,
        attributes: ['nombre_usuario'],
        include: [{
          model: Rol,
          attributes: ['rol']
        }]
      }],
      order: [['puntuacion', 'DESC']]
    });
    res.json(clasificaciones);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las clasificaciones' });
  }
};