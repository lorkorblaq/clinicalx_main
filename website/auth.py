from flask import app, Blueprint, render_template, request, session, url_for, redirect, flash, make_response, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from .forms import RegistrationForm, LoginForm, Newpassword, LabForm
# from .extensions import socketio
from flask_socketio import send, emit
from .db_clinicalx import db
from bson import ObjectId
import requests
import os
import jwt
import datetime
from functools import wraps
from .mailer import welcomeMail, send_verification_email
import logging
from .celeryMasters.inventoryMaster import watch_inventory_changes
from flask import current_app
from pymongo import MongoClient
# from .celeryMasters.chatMaster import chat_watcher

# Configure the logging settings
logging.basicConfig(filename='app.log', level=logging.INFO)



# jwt = JWTManager()
API_BASE_URL = "https://labpal.com.ng/api/user/push/"

auth = Blueprint("auth", __name__, static_folder="static", template_folder="templates")

USERS_COLLECTION = db['users']  
ORG_COLLECTION = db['org']
LABS_COLLECTION = db['labs']

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'email' in session and 'token' in session:
            return f(*args, **kwargs)
        else:
            return redirect(url_for('auth.auth_page'))
    return decorated

def time_left_until_expiration(token, secret_key):
    try:
        decoded_token = jwt.decode(token, secret_key)
        expiration_time = datetime.datetime.fromtimestamp(decoded_token['exp'])
        # print(expiration_time)
        current_time = datetime.datetime.now()
        time_left = expiration_time - current_time
        return time_left
    except jwt.ExpiredSignatureError:
        # Token has already expired
        return datetime.timedelta(seconds=0)
    except jwt.InvalidTokenError:
        # Invalid token
        return None


def create_labs_database(lab_id):
    client = MongoClient(current_app.config['MONGO_URI'])
    lab_db = client[lab_id]
    return db

@auth.route("/signin-signup", methods=['GET'])
def auth_page():
    login_form = LoginForm()
    register_form = RegistrationForm()
    labform = LabForm()
    return render_template("auth.html", login_form=login_form, register_form=register_form, labform=labform)

@auth.route("/signin-signup", methods=['POST'])
def signup_signin():
    login_form = LoginForm()
    register_form = RegistrationForm()
    labform = LabForm()
    if 'signup' in request.form:
        # Form submission for sign up
        if register_form.validate_on_submit():
            lab = register_form.lab.data.strip().lower()
            firstname = register_form.firstname.data
            lastname = register_form.lastname.data
            email = register_form.email.data.strip().lower()
            password = register_form.password.data
            confirm_password = register_form.confirm_password.data
            hashed_password = generate_password_hash(password)
            # if org_id is not 0:
            #     flash("Organisation not registered")
            #     return render_template("auth.html", login_form=login_form, register_form=register_form) 
            if not LABS_COLLECTION.find_one({'lab_name': lab}): 
                flash("Laboratory not registered. Please register your lab..", "warning") 
                return redirect(url_for('auth.auth_page'))  # Redirect to organization registration page           
            
            elif USERS_COLLECTION.find_one({'email': email}):
                flash("Email already exists")
                return redirect(url_for('auth.auth_page'))
            
            elif password == confirm_password:
                hashed_password = generate_password_hash(password)
                form_data = {
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email,
                    "password": hashed_password,
                }
                name=firstname + " " + lastname
                # print(form_data)
                try: 
                    user_id = USERS_COLLECTION.insert_one(form_data).inserted_id
                    if user_id:
                        LABS_COLLECTION.update_one({"lab_name": lab}, {"$push": {"users": str(user_id)}, "$set": {"subscription": "basic"}})
                        flash("Registration successful, you can now login", "success")
                        welcomeMail(email, name)
                        return redirect(url_for('auth.auth_page'))
                    elif not user_id:
                        flash("Failed to register user. Please try again or contact support", "danger")
                        return redirect(url_for('auth.auth_page'))
                except:
                    flash("Failed to register user. Please try again.", "danger")
                    return redirect(url_for('auth.auth_page'))
            
            elif password != confirm_password:
                flash("Passwords do not match.", "danger")
                return redirect(url_for('auth.auth_page'))
        else:
            flash("Please fill in your data correctly", "danger")
            return redirect(url_for('auth.auth_page'))
        
    elif 'signin' in request.form:
        email = login_form.email.data.strip().lower()
        print(email)
        password = login_form.password.data
        # Fetch user from MongoDB based on the provided email
        user = USERS_COLLECTION.find_one({'email': email})
        if user is not None and check_password_hash(user['password'], password):
            # watch_inventory_changes.delay()
            # chat_watcher.delay()
            identity ={}
            full_id = str(user['_id'])
            # session['session_id'] = session_id
            session['id'] = full_id

            ip_address = request.remote_addr
            # user_agent = request.user_agent.string
            full_id = str(user['_id'])
            part_id = full_id[-7:]
            firstname = user['firstname']
            lastname = user['lastname']
            name = firstname + " " + lastname
            logging.info(f"user:{name}, email:{email}, ip:{ip_address} at {datetime.datetime.now()}")
            # Passwords match, allow login
            # auth.logger.info(f"User logged in: {session['email']}")

            # flash("Login successful!", "success")
            # Your redirect logic here, e.g., redirect to dashboard
            session['ip_address'] = ip_address
            session['logged_in'] = True
            session['id'] = full_id
            session['part_id'] = part_id
            session['email'] = email
            session['firstname'] = firstname
            session['lastname'] = lastname
            session['name'] = name
            session['title'] = user.get('title', "")
            session['org'] = user.get('org', "")
            session['address'] = user.get('address', "")
            session['mobile'] = user.get('mobile', "")
            session['image'] = user.get('image', "")

            # stockAlert(email, name)

            secret_key = "LVUC5jSkp7jjR3O-"
            # secret_key = "LVUC5jSkp7jjR3O-"
            # print(secret_key)
            token = jwt.encode({
                'email': email, 
                'user': name, 
                'exp': str(datetime.datetime.now() + datetime.timedelta(minutes=240))
             }, 
            secret_key)
            session['time_left'] = time_left_until_expiration(token, secret_key)
            session['token'] = token
            # print(token)
            response = make_response(redirect(url_for('views.home')))
            response.set_cookie('user_id', full_id)
            response.set_cookie('email', email)
            response.set_cookie('name', name)
            # response.set_cookie('id', session_id)
            response.set_cookie('token', session['token'] )
            return response
            # return make_response
        else:
            # Either user does not exist or password is incorrect
            flash("Invalid login credentials.", "danger")
            return redirect(url_for('auth.auth_page'))
        
    elif 'create lab' in request.form:
        if labform.validate_on_submit():
            org_name = labform.org_name.data.strip().lower()
            lab_name = labform.lab_name.data.strip().lower()            
            managers_firstname = labform.managers_firstname.data
            managers_lastname = labform.managers_lastname.data
            managers_email = labform.managers_email.data.strip().lower()
            user = USERS_COLLECTION.find_one({'email': managers_email})

            # try:
            if not user:
                # LABS_COLLECTION.insert_one(lab_data)
                if ORG_COLLECTION.find_one({'org_name': org_name}):
                    flash("Organization already exists, please provide another name.", "warning")
                    return redirect(url_for('auth.auth_page'))
                else:
                    url = f"https://labpal.com.ng/registerlab?org_name={org_name}&lab_name={lab_name}&managers_firstname={managers_firstname}&managers_lastname={managers_lastname}&managers_email={managers_email}"
                    send_verification_email(managers_email, managers_firstname, url)
                    flash("Kindly check the inbox of the email you provided for verification to proceed", "success")
                    return redirect(url_for('auth.auth_page'))
            elif user:
                    user_id = user.get('_id')
                    org_id = user.get('org_id')
                    org = ORG_COLLECTION.find_one( {'_id': ObjectId(org_id)})
                    if org:
                        sub = org.get('subscription')
                        if sub == "basic":
                            flash(f"Please you are on the free teir. Kindly upgrade to proceed.", "warning")
                            return redirect(url_for('auth.auth_page'))
                        elif sub == "pro":
                            lab_data = {
                                "lab_name": lab_name,
                                "managers_email": managers_email,
                                "users": [str(user_id)],
                                "created_at": datetime.datetime.now(),
                            }
                            ORG_COLLECTION.update_one({"_id":ObjectId(org_id)}, {"$push": {"labs": lab_data}})
                            USERS_COLLECTION.update_one({"email": managers_email}, {"$push": {"labs_access": lab_name}})
                            flash("Lab created successfully", "success")
                            return redirect(url_for('auth.auth_page'))
            # except:
            #     flash("Failed to create lab., please try again or contact support", "danger")
            #     return redirect(url_for('auth.auth_page'))

@auth.route('/registerlab', methods=['GET', 'POST'])
def register_lab():
    register_form = RegistrationForm()
    org_name = request.args.get('org_name')
    lab_name = request.args.get('lab_name')
    managers_firstname = request.args.get('managers_firstname')
    managers_lastname = request.args.get('managers_lastname')
    managers_email = request.args.get('managers_email')

    if request.method == 'POST':
        password = register_form.password.data
        confirm_password = register_form.confirm_password.data

        if password != confirm_password:
            flash("Passwords do not match.", "danger")
            return redirect(url_for('auth.register_lab'))

        hashed_password = generate_password_hash(password)

        try:
            # Register the user
            user_data = {
                "firstname": managers_firstname,
                "lastname": managers_lastname,
                "email": managers_email,
                "password": hashed_password,
                "subscription": "basic",
                "created_at": datetime.datetime.now()
            }
            user_id = USERS_COLLECTION.insert_one(user_data).inserted_id

            # Register the lab and organization
            if user_id:
                lab_data = {
                    "lab_name": lab_name,
                    "managers_email": managers_email,
                    "users": [str(user_id)],
                    "created_at": datetime.datetime.now(),
                }
                org_data = {
                    "org_name": org_name,
                    "labs": [lab_data],
                    "subscription": "basic",
                    "creator": str(user_id),
                    "created_at": datetime.datetime.now(),
                }
                org_id = ORG_COLLECTION.insert_one(org_data).inserted_id

                if org_id:
                    USERS_COLLECTION.update_one(
                        {"email": managers_email},
                        {
                         "$set": {"role": "creator"}, 
                         "$set": {"org_id": str(org_id)},
                         "$push": {"labs_access": lab_name}
                        }
                    )
                    flash("Registration successful, you can now login", "success")
                    return redirect(url_for('auth.auth_page'))
                else:
                    flash("Failed to register organization. Please try again or contact support", "danger")
                    return redirect(url_for('auth.register_lab'))
            else:
                flash("Failed to register user. Please try again or contact support", "danger")
                return redirect(url_for('auth.register_lab'))

        except Exception as e:
            flash(f"Failed to register. Error: {str(e)}", "danger")
            return redirect(url_for('auth.register_lab'))

    return render_template("reg_lab.html", lab=lab_name, lastname=managers_lastname, firstname=managers_firstname, register_form=register_form)


@auth.route('/subscription', methods=['GET', 'POST'])
def subscription():
    return render_template("subscription.html")

@auth.route('/logout', methods=['GET'])
def logout():
    # Assuming the token is sent in the request headers
    logging.info(f"{session['email']} logout, {session['ip_address']} at {datetime.datetime.now()}")
    session.clear()
    flash("You have been successfully logged out.", "success")
    response = make_response(redirect(url_for('auth.auth_page')))
    response.delete_cookie('user_id')
    response.delete_cookie('email')
    response.delete_cookie('name')
    response.delete_cookie('token')
    return response

@auth.route('confirm_password/settings', methods=['POST'], strict_slashes=False)
def password_reset():
    new_pass = Newpassword()
    if new_pass.validate_on_submit():
        current_password = new_pass.current_password.data
        new_password = new_pass.new_password.data
        confirm_password = new_pass.confirm_password.data
        
        if new_password != confirm_password:
            flash("Passwords do not match")
            return redirect(url_for('auth.password_reset'))

        user = USERS_COLLECTION.find_one({"email": session.get('email')})
        if user and check_password_hash(user['password'], current_password):
            hashed_password = generate_password_hash(new_password)
            USERS_COLLECTION.update_one({"email": session['email']}, {"$set": {"password": hashed_password}})
            flash("Password reset successful")
            return render_template("settings.html", new_pass=new_pass)
        else:
            flash("Invalid current password")
            return render_template("settings.html", new_pass=new_pass)
    else:
        flash("Form validation failed")
        return render_template("settings.html", new_pass=new_pass)
