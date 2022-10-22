var socket = io()

socket.on('alert', function(msg){
    alert(msg)
})