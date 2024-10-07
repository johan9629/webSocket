import express from 'express';
import config from './config.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('/views', viewsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));


const httpServer = app.listen(config.PORT, () => { console.log(`Servidor activo en puerto ${config.PORT}`); });
const socketServer = new Server(httpServer);
const messages = [];

socketServer.on('connection', socket => {
    console.log(`Usuario conectado ${socket.id}`);

    socket.on('new_own_msg', data => {
        messages.push(data);
        socketServer.emit('new_msg', data);
    });

    socket.on("new_user_data", data => {
        socket.emit("current_messages", messages);
        socket.broadcast.emit("new_user", data)
    })
});
