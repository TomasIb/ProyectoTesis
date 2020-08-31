from flask_socketio import SocketIO,emit
# socketio = SocketIO(cors_allowed_origins="*",logger=True, engineio_logger=True,async_mode="eventlet") #DEBUG
socketio = SocketIO(cors_allowed_origins="*",async_mode="eventlet") #PROD

@socketio.on('connect')
def test_connect():
      print("Connected to local server")
      emit('connect', {'data': 'Connected to local server! ayy'})

@socketio.on('disconnect')
def test_disconnect():
      print("Disconnected to local server")
      emit('disconect', {'data': 'Disconnected to local server :('})

