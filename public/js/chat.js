const socket=io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates

const messageTemplates=document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//options

const { username,room} = Qs.parse (location.search,{ ignoreQueryPrefix:true })

socket.on('message',(message)=>{
console.log(message)
const html=Mustache.render(messageTemplates,{
  message: message.text,
  createdAt: moment(message.createdAt).format('h:mm a')
})
$messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(message)=>{
console.log(message)
const html=Mustache.render(locationMessageTemplate,{
  url:message.url,
  createdAt:moment(message.createdAt).format('h:mm a')

})
$messages.insertAdjacentHTML('beforeend',html)
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButtton.setAttribute('disabled','disabled')

// disabled
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => { // Pass a callback function
      $messageFormButtton.removeAttribute('disabled')
      $messageFormInput.value=''
      $messageFormInput.focus()
      // enabled
      if (error) {
        console.log(error); // Handle the error if the server sends any
      } else {
        console.log('Message Delivered');
      }
    });
})

$sendLocationButton.addEventListener('click',()=> {
  if (!navigator.geolocation){
    return alert('geoLocation does not support in your browser.')
  }

  $sendLocationButton.setAttribute('disabled','disabled')


  navigator.geolocation.getCurrentPosition((position)=>{

socket.emit('sendLocation',{
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
},()=>{
  $sendLocationButton.removeAttribute('disabled')
  console.log('Location Shared')
})
  })
})

socket.emit('join', {username,room})











// it used for the Button count s
// socket.on('countUpdated',(count)=>{
//     console.log('the count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("Clicked")
//     socket.emit('increment')
// })
