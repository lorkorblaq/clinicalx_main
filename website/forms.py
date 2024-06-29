from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, DateField, BooleanField, EmailField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
import email_validator

class LabForm(FlaskForm):
    org_name = StringField('org', validators=[DataRequired(), Length(min=4, max=20)], render_kw={"placeholder":"Organisation name"})
    lab_name = StringField('lab', validators=[DataRequired(), Length(min=4, max=20)], render_kw={"placeholder":"Laboratory name"})
    managers_firstname = StringField('Firstname', validators=[DataRequired(), Length(min=3, max=20), ], render_kw={"placeholder":"Managers first name"})
    managers_lastname = StringField('Lastname', validators=[DataRequired(), Length(min=3, max=20),],  render_kw={"placeholder":"Managers last name"})
    managers_email = EmailField('Email',validators=[DataRequired(), Email()], render_kw={"placeholder":"Managers Email address"})
    submit = SubmitField('create lab')


class RegistrationForm(FlaskForm):
    org_id = StringField('org', validators=[DataRequired(), Length(min=4, max=90)], render_kw={"placeholder":"Organisation Id"})
    lab = StringField('lab', validators=[DataRequired(), Length(min=4, max=20)], render_kw={"placeholder":"Laboratory name"})
    firstname = StringField('Firstname', validators=[DataRequired(), Length(min=3, max=20), ], render_kw={"placeholder":"First name"})
    lastname = StringField('Lastname', validators=[DataRequired(), Length(min=3, max=20),],  render_kw={"placeholder":"Last name"})
    email = EmailField('Email',validators=[DataRequired(), Email()], render_kw={"placeholder":"Email address"})
    password = PasswordField('Password',validators=[DataRequired(), ],  render_kw={"placeholder":"Password"})
    confirm_password = PasswordField('Confirm Password',validators=[DataRequired(), EqualTo('password')], render_kw={"placeholder":"Verify password"})
    submit = SubmitField('Sign Up')

    # def organisation_id(self, id):
    #     ordid = User.query.filter_by(username=username.data).first()
    #     if user:
    #         raise ValidationError('That username is taken. Please choose a different one.')

class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[DataRequired(), Email(),],  render_kw={"placeholder":"Email address"})
    password = PasswordField('Password',validators=[DataRequired()],  render_kw={"placeholder":"Password"})
    submit = SubmitField('Login')


class Resetpassword(FlaskForm):
    email = StringField('Email',validators=[DataRequired(), Email()],  render_kw={"email":"Email address"})
    submit = SubmitField('Request Password Reset')

class Newpassword(FlaskForm):
    current_password = PasswordField('Current Password', validators=[DataRequired()], render_kw={"placeholder":"Current Password"})
    new_password = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder":"New Password"})
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('new_password')], render_kw={"placeholder":"Verify password"})
    submit = SubmitField('Reset Password')