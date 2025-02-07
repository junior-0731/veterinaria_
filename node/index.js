const express = require('express')
const cors = require('cors')
const axios = require('axios'); // Librería para hacer solicitudes HTTP
const jwt = require('jsonwebtoken');
require("dotenv").config();


const app = express()
const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL;

// Middleware para habilitar CORS
app.use(cors())
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
    next();
});

// ruta para la validacion de veterinario con FastAPI
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    try {
        // envio los datos de las credenciales a Fastapi
        const fastApiResponse = await axios.post(`${process.env.FASTAPI_BASE_URL}/api/v1/veterinario/`, {
            username: username,
            password: password
        },{
            headers:{
                'Content-Type':'application/json'
            }
        });
        console.log("enviando a fazt api")

        // si FastAPI valida, crear el token con los datos adicionales
        const userData = fastApiResponse.data // datos de la respuesta de FastAPI
        const tokenPayload = {
            username: userData.username,
            nombres: userData.nombres,
            apellidos: userData.apellidos,
            direccion: userData.direccion,
            telefono: userData.telefono,
            tarjeta_profesional: userData.tarjeta_profesional,
            id: userData.id
        };

        const accessToken = generateAccessToken(tokenPayload)
        const refreshToken = generateRefreshToken(tokenPayload)

        return res.status(200).json({
            message: "User validated successfully",
            token: accessToken,
            refreshtoken: refreshToken,
            userData: userData
        });
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            return res.status(statusCode).json({ error: `Error ${statusCode}: ${error.response.data.message || 'Ocurrió un error'}` });
        }
    // return res.status(500).json({ error: 'Error al comunicarse con FastAPI' });
    console.error("Error al comunicarse con FastAPI:", error.message)
    res.status(500).json({ error: "Error interno del servidor"})
    }
});

// falta asignar un id a la respuesta de fastapi
//ruta para solicitar datos del veterinario que se van a actualizar y enviarlos a fastapi
app.put("/actualizarVeterinario", async (req, res) => {
    const {id, names, lastNames, address, phone, professionalCard } = req.body;

    // if (!id || !names || !lastNames || !address || !phone || !professionalCard) {
    //     return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar el veterinario' });
    // }

    try {
        // envio los datos de las credenciales a Fastapi
        const fastApiResponse = await axios.put(`${process.env.FASTAPI_BASE_URL}/api/v1/veterinario/update`, {
            id:id,
            nombres: names,
            apellidos: lastNames,
            direccion: address,
            telefono: phone,
            tarjeta_profesional: professionalCard
        },{
            headers:{
                'Content-Type':'application/json'
            }
        });
        console.log("enviando a fazt api")

        // si FastAPI valida, crear el token con los datos adicionales
        const userData = fastApiResponse.data // datos de la respuesta de FastAPI

        return res.status(200).json({
            message: "updated vet details",
            userData: userData
        });
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            return res.status(statusCode).json({ error: `Error ${statusCode}: ${error.response.data.message || 'Ocurrió un error'}` });
        }
    // return res.status(500).json({ error: 'Error al comunicarse con FastAPI' });
    console.error("Error al comunicarse con FastAPI:", error.message)
    res.status(500).json({ error: "Error interno del servidor"})
    }
});

app.post("/RegistrarPropietario", async (req, res) => {
    const { idPropietario, nombresPropietario, direccionPropietario, telefonoPropietario, correoPropietario } = req.body;

    // if (!id || !names || !lastNames || !address || !phone || !professionalCard) {
    //     return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar el veterinario' });
    // }

    try {
        // envio los datos de las credenciales a Fastapi
        const fastApiResponse = await axios.post(`${process.env.FASTAPI_BASE_URL}/api/v1/propietario/`, {
            idPropietario:idPropietario,
            nombresPropietario:nombresPropietario,
            direccionPropietario:direccionPropietario,
            telefonoPropietario:telefonoPropietario,
            correoPropietario:correoPropietario,
        },{
            headers:{
                'Content-Type':'application/json'
            }
        });
        console.log("enviando datos mascota afazt api")

        // si FastAPI valida, crear el token con los datos adicionales
        const userData = fastApiResponse.data // datos de la respuesta de FastAPI

        return res.status(201).json({
            message: "registered owner",
            userData: userData
        });
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            return res.status(statusCode).json({ error: `Error ${statusCode}: ${error.response.data.message || 'Ocurrió un error'}` });
        }
    // return res.status(500).json({ error: 'Error al comunicarse con FastAPI' });
    console.error("Error al comunicarse con FastAPI:", error.message)
    res.status(500).json({ error: "Error interno del servidor"})
    }
});



app.post("/RegistrarMascota", async (req, res) => {
    const { nameMascota, colorMascota, razaMascota, idPropietario, idVeterinario } = req.body;

    // if (!id || !names || !lastNames || !address || !phone || !professionalCard) {
    //     return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar el veterinario' });
    // }

    try {
        // envio los datos de las credenciales a Fastapi
        const fastApiResponse = await axios.post(`${process.env.FASTAPI_BASE_URL}/api/v1/pets/`, {
            nameMascota:nameMascota,
            colorMascota: colorMascota,
            razaMascota: razaMascota,
            idPropietario: idPropietario,
            idVeterinario: idVeterinario,
        },{
            headers:{
                'Content-Type':'application/json'
            }
        });
        console.log("enviando datos mascota afazt api")

        // si FastAPI valida, crear el token con los datos adicionales
        const userData = fastApiResponse.data // datos de la respuesta de FastAPI

        return res.status(201).json({
            message: "registered pet",
            userData: userData
        });
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            return res.status(statusCode).json({ error: `Error ${statusCode}: ${error.response.data.message || 'Ocurrió un error'}` });
        }
    // return res.status(500).json({ error: 'Error al comunicarse con FastAPI' });
    console.error("Error al comunicarse con FastAPI:", error.message)
    res.status(500).json({ error: "Error interno del servidor"})
    }
});


function generateAccessToken(credentials) {
    return jwt.sign(credentials, process.env.SECRET, { expiresIn: '5m' });
}

function generateRefreshToken(credentials) {
    return jwt.sign(credentials, process.env.SECRET, { expiresIn: '7d' });
}


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


const port = 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
