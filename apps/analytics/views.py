from fabfile import localhost, remote
from flask import session, redirect, url_for, render_template, request
from . import analytics


@analytics.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@analytics.route('/dashboard.html', methods=['GET', 'POST'])
def dashboard():
    return render_template('dashboard.html')


@analytics.route('/list/')
def list():
    result = localhost('list')
    ls_list = result['<local-only>'].split("\n")
    print ls_list
    return render_template('list.html', list=ls_list)