from flask_mail import Message
from flask import current_app

def mailer(emailh, subjecth, htmlh):
    with current_app.app_context():
        mail = current_app.extensions['mail']
        message = Message(
            subject=subjecth,
            recipients=[emailh],
        )
        message.html = htmlh
        return mail.send(message)

def welcomeMail(email, name):
    subject="Hy from LabPal"    
    html = f'<h1>Welcome {name}, to Labpal.</h1>'
    mailer(email, subject, html)
    # return "Email sent"


# def stockAlert(email, name):
#     alert_items = []
#     for item in items:
#         if 4 < item['in stock'] < 5:
#             item_name = item['item']
#             quantity = item['in stock']
#             test = f'{item_name} has {quantity} vials in stock'
#             alert_items.append(test)
#         # print(alert_items)
#     subject="Stock Alert"
     
#     html = f'<h5>Hello {name},<br></h5><p>Your stock alert level: <br>{ "<br>".join(alert_items) }</p>'
#     # mail.send(message)
#     mailer(email, subject, html)




    