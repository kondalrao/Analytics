from flask import Blueprint

analytics = Blueprint('analytics', __name__, url_prefix='/analytics', static_folder='static', template_folder='templates')

import views, events
