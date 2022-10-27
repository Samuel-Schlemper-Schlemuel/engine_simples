Pusher.logToConsole = true

var pusher = new Pusher('c8ba7e505c0d452fd3fa', {
    cluster: 'sa1'
})

var channel = pusher.subscribe('my-channel')

channel.bind('my-event', function(data) {
    alert(data.message)
})