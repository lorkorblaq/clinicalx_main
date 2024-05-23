from flask import Blueprint, render_template, request, url_for, redirect, flash, make_response, session
import requests
from flask_cors import CORS
from .auth import auth_required
from flask_mail import Message, Mail
from .extensions import socketio
from flask_socketio import send, emit
# from  .celeryMasters.inventoryMaster import *
from .forms import Newpassword


BASE = "http://16.171.42.4:3000/api"
views = Blueprint("views", __name__, static_folder="static", template_folder="templates")
CORS(views)
data=""


@views.route("/",  strict_slashes=False)
@auth_required
def home():
    return render_template("index.html")

@views.route("/dashboard",  strict_slashes=False)
@auth_required
def dashboard():
    return render_template('dashboard.html', dash_app_url='http://localhost:8050')

@views.route("/inventory",  strict_slashes=False)
@auth_required
def inventory():
    return render_template("inventory.html", data=data)

@views.route("/expiration",  strict_slashes=False)
@auth_required
def expiration():
    return render_template("expiration.html", data=data)
    
@views.route("/in-use", methods=['GET','POST'],  strict_slashes=False)
@auth_required
def put_in_use():
    return render_template("put-in-use.html", data=data)


@views.route("/channels",  strict_slashes=False)
@auth_required
def channels():
    return render_template("channels.html", data=data)

@views.route("/port",  strict_slashes=False)
@auth_required
def port():
    return render_template("port.html", data=data)

@views.route("/chat",  strict_slashes=False)
@auth_required
def chat():
    return render_template("/templates_for_messenger/messenger.html", data=data)

@views.route("/gpt",  strict_slashes=False)
@auth_required
def gpt():
    return render_template("/templates_for_gpt/gpt.html", data=data)

@views.route("/user-profile",  strict_slashes=False)
@auth_required
def userProfile():
    data ={
        "firstname": session['firstname'],
        "lastname": session['lastname'],
        "part_id": session['part_id'],
        "id": session['id'],
        "title": session['title'],
        "name": session['name'],
        "org": session['org'],
        "email": session['email'],
        "address": session['address'],
        "mobile": session['mobile']
    }
    return render_template("user-profile.html", name=session['name'], data=data)

@views.route("/settings", methods=['GET'], strict_slashes=False)
@auth_required
def settings():
    new_pass = Newpassword()
    return render_template("settings.html", new_pass=new_pass, name=session['name'], email=session['email'])
