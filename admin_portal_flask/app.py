from flask import Flask, request, render_template, session, flash, redirect
from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqla import ModelView

from model import User, init,  recreate
app = Flask(__name__)
app.config.update(dict(
    DATABASE='/tmp/flaskr.db',
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
session_db = init('sqlite:///prova.db')
admin = Admin(app)
recreate()
# Add administrative views here
admin.add_view(ModelView(User, session_db))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] == 'USERNAME':
            error = 'Invalid username'
        elif request.form['password'] == 'PASSWORD':
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect('/admin')
    return render_template('login.html', error=error)
    

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect('/login')
    
    
app.run()
