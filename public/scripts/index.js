const socket = io();
function contactMail(){
    const mail = {
        'email': document.getElementById('email').value,
        'subject': document.getElementById('subject').value,
        'message': document.getElementById('message').value
    }

    socket.emit('contactmail', mail);
}