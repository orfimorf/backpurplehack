require('dotenv').config() //Подключение к окружению
const express = require('express') //Подключение фреймворка
const sequelize = require('./db')  //Подключение к бд
const PORT = process.env.PORT || 5000 //Инициализация порта
const app = express() //Объект приложения




// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));


app.use(express.json())  //Это чтобы приложение могло парсить json формат

// app.use('/api', router)

//Обработка ошибок, последний Middleware
//!!!РЕГИСТРИРУЕТСЯ ОБЯЗАТЕЛЬНО В САМОМ КОНЦЕ!!!
// app.use(errorHandler)



//Запуск сервера
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