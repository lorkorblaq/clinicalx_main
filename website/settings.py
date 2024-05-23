from flask import Blueprint, render_template, request, url_for, redirect, flash, make_response, session
import requests
from flask_cors import CORS
from .auth import auth_required
from flask_mail import Message, Mail

BASE = "http://16.171.42.4:3000/api"
settings = Blueprint("settings", __name__, static_folder="static/static_for_settings", template_folder="templates/templates_for_settings")
CORS(settings)
data=""


@settings.route("/",  strict_slashes=False)
@auth_required
def homeSettings():
    return render_template("settings.html", name=session['name'], email=session['email'])


@settings.route("/security",  strict_slashes=False)
@auth_required
def security():
    newpassword = "********"
    data ={
        "password": newpassword   }
    return render_template("security.html", name=session['name'], data=data)

@settings.route("/billing",  strict_slashes=False)
@auth_required
def billing():
    data ={
        "firstname": session['firstname'],
        "lastname": session['lastname'],
        "id": session['id'],
        # "title": session['title'],
        "name": session['name'],
        # "org": session['org'],
        "email": session['email'],
        # "address": session['address'],
        # "mobile": session['mobile']
    }
    return render_template("billing.html", name=session['name'], data=data)


@settings.route("/notifications",  strict_slashes=False)
@auth_required
def notifications():
    data ={
        "firstname": session['firstname'],
        "lastname": session['lastname'],
        "id": session['id'],
        # "title": session['title'],
        "name": session['name'],
        # "org": session['org'],
        "email": session['email'],
        # "address": session['address'],
        # "mobile": session['mobile']
    }
    return render_template("notifications.html", name=session['name'], data=data)