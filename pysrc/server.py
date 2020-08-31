import multiprocessing
from app import create_app,socketio
import eventlet
eventlet.monkey_patch(os=False, select=False, socket=True, time=True)


app = create_app()

if __name__ == '__main__':   
    multiprocessing.freeze_support()    
    print("server is running")    
    socketio.run(app,host="0.0.0.0",port=5000)
