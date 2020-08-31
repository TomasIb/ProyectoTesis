import io from 'socket.io-client';
var socket = io.connect('http://127.0.0.1:5000/', { reconection: false });
function connect(cb) {

  socket.on("connect", message => {
    cb(message);
  });

}
function disconnect(cb) {

  socket.on("disconnect", message => {
    cb(message);
  });

}

function message(cb) {
  // listen for any messages coming through
  // of type 'message' and then trigger the
  // callback function with said message
  socket.on("message", message => {
    // trigger the callback passed in when
    // our App component calls message      
    cb(message);
  });

}

export { connect, message ,disconnect};