const socket = io();

socket.on('contactmail', mail => {
    console.log(mail);
    $.notify('contact mail from\n' + mail.email, {
        autoHide: false,
        className: 'success'
    });
});