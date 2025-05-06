import server from './server.js';

server.listen(server.get("PORT"), () =>{
    console.log(`Ejecutado en el puerto: http://localhost:${server.get("PORT")}`);  
});