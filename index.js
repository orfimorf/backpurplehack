require('dotenv').config()
const express = require('express')
const cors = require('cors') //Импорт cors
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require("./routers");
const PORT = process.env.PORT || 5000
const app = express()
const model = require('./models')
const errorHandler = require('./middlewares/ErrorHandlingMiddleware')
const serverConfiguration = require('./ServerConfiguration')


const corsOptions ={
    origin: process.env.CLIENT,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.json())
app.use(fileUpload({}));
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter:true})
        await serverConfiguration.reInitializeServer()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()