from flask import Flask, request, render_template
from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqla import ModelView

from model import User, init,  recreate
app = Flask(__name__)
session = init('sqlite:///prova.db')
admin = Admin(app)
recreate()
# Add administrative views here
admin.add_view(ModelView(User, session))
app.debug = True
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_entries'))
    return render_template('login.html', error=error)
    

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_entries'))
    
    
app.run()
