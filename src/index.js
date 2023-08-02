const path=require('path')
const http=require('http')
const express = require('express')
const socketio= require('socket.io')
const Filter=require('bad-words')
const{generateMessage,generateLocationMessage} = require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io = socketio(server)

const port =process.env.PORT || 3000
const publicDirectoryPath =path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let count =0;

//server (emit)==>client  (receive) - countUpdated
//client (emit)==>server (receive) -increament

io.on('connection',(socket)=>{
    console.log('New Websocket Connection')

// this is for Welcome Message to the user
  socket.on('join',({username,room})=>{
    socket.join(room)

    socket.emit('message',generateMessage('Welcome!'))
    socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined`))

    //socket.emit =>Send to specifc connection , io.emit => to connnect with the specific connection ,  
    // io.to.emit => it is emit to everybody for the specific room , socket.broadcast.emit.io => emit to spcific chat room 

    
  })

socket.on('sendMessage', (message, callback) => {
    const filter=new Filter()
    if(filter.isProfane(message)){
        return callback('Profanity is not allowed!')
    }
    if (message) {
      io.emit('message',generateMessage(message));
      callback(); // Call the callback function to signal successful message delivery
    } else {
      callback('Message is empty.'); // Pass an error message to the callback if the message is empty
    }
  });

socket.on('sendLocation', (coords,callback) =>{
io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
callback()
})

socket.on('disconnect',()=>{
    io.emit('message',generateMessage('A user has left'))
})

})

server.listen(port,()=>{
    console.log(`Server is on the port ${port}!`)
})














 // This is used for the Count
// socket.emit('countUpdated',count)
// socket.on('increment',()=>{
//     count++
//     // socket.emit('countUpdated',count)  // Not want to emit for the specific connnection
//     io.emit('countUpdated',count)
// })