from fabric.api import local, execute, env, run
from StringIO import StringIO

env.user = "admin"
env.password = "nbv_12345"


def list():
    return local('ls -l', capture=True)


def top():
    return local('top -o -cpu -l1 -n10', capture=True)


def localhost(fn_name=None):
    if fn_name == 'list':
        return execute(list)
    elif fn_name == 'top':
        return execute(top)


def remote(fn_name=None, tcb=0):
    if fn_name == 'list_int':
        return execute(list_int, tcb, hosts=['admin@172.23.151.203'])


def list_int(tcb=0):
    fh = StringIO()
    run("config t", shell=False, stdout=None, stderr=None)
    run("attach module 2", shell=False, stdout=None, stderr=None)
    # run("sh int br", shell=False, stdout=fh, stderr=None)
    run("sh system internal vntag event-history tcb " + str(tcb), shell=False, stdout=fh, stderr=None)

    fh.seek(0)
    return parse_tcb(fh)
