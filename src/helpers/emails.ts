import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const emailRegistro = async (datos) => {
    const {email_usuario, nombre_usuario, token_usuario} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.MASTER_H,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MASTER_EM,
          pass: process.env.MASTER_P
        }
      });
    // Información del email
    const info = await transport.sendMail({
        from: '"CountAll — Administrador de la Base de Datos" «countall2024b021@gmail.com»',
        to: email_usuario,
        subject: "CountAll — Confirme su cuenta",
        text: "Compruebe su cuenta en CountAll",
        html: `
        <p>Hola, ${nombre_usuario}, compruebe su cuenta en CountAll.</p>
        <p>Su cuenta está casi lista; sólo es necesario finalizar su proceso de confirmación.</p>
        <p>Para finalizar este proceso, ingrese en el enlace que tiene a continuación:</p>
        <p>http://localhost:4444/api/usuario/confirmarUsuario/${token_usuario}</p>
        <p>Si usted no creó esta cuenta, por favor ignore este correo electrónico.</p>
        `
    })
}

const emailRestablecimiento = async (datos) => {
    const {email_usuario, nombre_usuario, token_usuario} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.MASTER_H,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MASTER_EM,
          pass: process.env.MASTER_P
        }
      });
    // Información del email
    const info = await transport.sendMail({
        from: '"CountAll — Administrador de la Base de Datos" «countall2024b021@gmail.com»',
        to: email_usuario,
        subject: "CountAll — Restablezca su contraseña",
        text: "Restablezca su contraseña en CountAll",
        html: `
        <p>Hola, ${nombre_usuario}, restablezca su contraseña en CountAll.</p>
        <p>Para continuar con este proceso, ingrese en el enlace que tiene a continuación:</p>
        <p>http://localhost:4444/api/usuario/comprobarToken/${token_usuario}</p>
        <p>Si usted no creó esta cuenta o está vinculado con CountAll, por favor ignore este correo electrónico.</p>
        `
    })
}

export {
    emailRegistro,
    emailRestablecimiento
}
