import os, string, random
from pathlib import Path


basedir =  os.path.join(os.path.expanduser('~'), 'Documents')

class Config(object):           
    SECRET_KEY = os.environ.get("SECRET_KEY")
    CLIENTS_FOLDER = basedir + '/PipeUserAnalysis'
    if not os.path.exists(CLIENTS_FOLDER):
        os.makedirs(CLIENTS_FOLDER)

    