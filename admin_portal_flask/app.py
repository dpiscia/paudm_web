from flask import Flask
from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqlamodel import ModelView
from model import User, init,  recreate
app = Flask(__name__)
session = init('sqlite:///prova.db')
admin = Admin(app)
recreate()
# Add administrative views here
admin.add_view(ModelView(User, session))
app.debug = True
app.run()
