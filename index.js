require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require("./routers");
const PORT = process.env.PORT || 5000
const app = express()
const model = require('./models')
const errorHandler = require('./middlewares/ErrorHandlingMiddleware')

app.use(express.json())
app.use(fileUpload({}));
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter:true})
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

    } catch (e) {
        console.log(e)
    }
}

start()