from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from flask_cors import CORS
from fbauth import check_token
import re
from flask_mail import Mail, Message
import json
from dt_format import toDtObject
from use_selenium import reserve_activity, cancel_activity, encrypt_pw

app = Flask(__name__)

mail_sender = Mail(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'borrow.sqlite')

db = SQLAlchemy(app)
ma = Marshmallow(app)

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'




class Event(db.Model):
    event_id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(100), nullable=False)
    event_time = db.Column(db.DateTime)
    event_place = db.Column(db.String(100), nullable=False)
    event_duration = db.Column(db.Integer)
    end_reservation_date = db.Column(db.DateTime)
    info_url = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String)
    
    def __init__(self, event_id, event_name, event_time, event_place, event_duration, end_reservation_date, info_url, tags):
        self.event_id = event_id
        self.event_name = event_name
        self.event_time = event_time
        self.event_place = event_place
        self.event_duration = event_duration
        self.end_reservation_date = end_reservation_date
        self.info_url = info_url
        self.tags = tags

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String)
    user_name = db.Column(db.String(20), nullable=False)
    user_pw = db.Column(db.String(100), nullable=False)
    events = db.Column(db.String)

    def __init__(self, user_name, uid, user_pw, events):
        self.user_name = user_name
        self.uid = uid
        self.user_pw = user_pw
        self.events = events


class EventSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('event_id', 'event_name', 'event_time', 'event_place', 'event_duration', 'end_reservation_date', 'info_url', 'tags')

class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('user_name','uid', 'user_pw', 'events')

class UserEventSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'event_name', 'event_time', 'event_place', 'event_duration', 'end_reservation_date', 'is_reserved', 'info_url', 'tags')

event_schema = EventSchema()
events_schema = EventSchema(many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

user_event_schema = UserEventSchema()
user_events_schema = UserEventSchema(many=True)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
#           Event CRUD          #
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
# endpoint to create new event
@app.route("/event", methods=["POST"])
#@check_token
def add_event():
    columns = ['event_id', 'event_name', 'event_time', 'event_place', 'event_duration', 'end_reservation_date', 'info_url', 'tags']
    col_values = []
    for c in columns:
        if c in request.values:
            if c in ['event_time', 'end_reservation_date']:
                col_values.append(toDtObject(request.values[c]))
            else:
                col_values.append(request.values[c])
        else:
            col_values.append("None")
        
    new_event = Event(*col_values)
    
    db.session.add(new_event)
    db.session.commit()

    return {'message': 'successfully create new event'},200

# endpoint to show all events
@app.route("/event", methods=["GET"])
def get_event():
    all_events = Event.query.all()
    result = events_schema.dump(all_events)

    result_json = events_schema.jsonify(result)

    return result_json

# endpoint to get event detail by id
@app.route("/event/<id>", methods=["GET"])
def event_detail(id):
    event = Event.query.get(id)

    return event_schema.jsonify(event)


# endpoint to update event
@app.route("/event/<id>", methods=["PUT"])
#@check_token
def event_update(id):
    event = Event.query.get(id)
    columns = ['event_id', 'event_name', 'event_time', 'event_place', 'event_duration', 'end_reservation_date', 'info_url', 'tags']
    for c in columns:
        if c in request.values:
            if c in ['event_time', 'end_reservation_date']:
                setattr(event, c, toDtObject(request.values[c]))
            else:
                setattr(event, c, request.values[c])
            

    db.session.commit()
    #return event_schema.jsonify(event)
    return {'message': 'successfully update event'}, 200


# endpoint to delete event
@app.route("/event/<id>", methods=["DELETE"])
#@check_token
def event_delete(id):
    event = Event.query.get(id)

    db.session.delete(event)
    db.session.commit()

    # return event_schema.jsonify(event)
    return {'message': 'successfully delete event'}, 200

# endpoint to get event for certain user
@app.route("/user_events", methods=["GET"])
@check_token
def user_events(**kwargs):
    current_user = kwargs['user']
    user = User.query.filter_by(uid=current_user).first()
    
    all_events = Event.query.all()
    reserved_events = json.loads(getattr(user, 'events'))
    reservation = {}
    for e in all_events:
        if getattr(e, 'event_id') in reserved_events:
            reservation[getattr(e, 'event_id')] = True
        else:
            reservation[getattr(e, 'event_id')] = False

    result = events_schema.dump(all_events)

    
    for t in result:
        t['is_reserved'] = reservation[t['event_id']]
        t['id'] = t['event_id']
    
    result_json = user_events_schema.jsonify(result)

    return result_json

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
#          user CRUD             #
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
# endpoint to create new user
@app.route("/user", methods=["POST"])
#@check_token
def add_user():
    columns = ['user_name', 'uid']
    col_values = []
    for c in columns:
        if c in request.values:
            col_values.append(request.values[c])
        else:
            col_values.append(None)
    col_values.append(encrypt_pw(request.values['user_pw']))
    col_values.append('[]')
    new_user = User(*col_values)
    
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'successfully create new user'},200


# endpoint to show all users
@app.route("/user", methods=["GET"])
def get_user():
    all_users = User.query.all()
    result = users_schema.dump(all_users)

    result_json = users_schema.jsonify(result)

    return result_json

# endpoint to get user detail by id
@app.route("/user/<id>", methods=["GET"])
def user_detail(id):
    user = User.query.get(id)

    return user_schema.jsonify(user)


# endpoint to update user
@app.route("/user/<id>", methods=["PUT"])
#@check_token
def user_update(id):
    user = User.query.get(id)
    columns = ['user_name', 'uid', 'user_pw', 'events']
    for c in columns:
        if c in request.values:
            setattr(user, c, request.values[c])

    db.session.commit()
    return {'message': 'successfully update user'}, 200


# endpoint to delete user
@app.route("/user/<id>", methods=["DELETE"])
#@check_token
def user_delete(id):
    user = User.query.get(id)

    db.session.delete(user)
    db.session.commit()

    return {'message': 'successfully delete user'}, 200


@app.route('/reserve', methods=["POST"])
@check_token
def reserve(**kwargs):
    current_user = kwargs['user']
    user = User.query.filter_by(uid=current_user).first()
    event_id = int(request.values["event_id"])

    #success = reserve_activity(event_id)
    success = True
    if success:
        events = json.loads(getattr(user, 'events'))
        events.append(event_id)
        setattr(user, 'events', json.dumps(events))
        db.session.commit()
        return {'message': 'reserve successful'},200
    else:
        return {'message': 'reserve failed'},500

@app.route('/cancel', methods=["POST"])
@check_token
def cancel(**kwargs):
    current_user = kwargs['user']
    user = User.query.filter_by(uid=current_user).first()
    event_id = int(request.values["event_id"])

    #success = cancel_activity(event_id)
    success = True
    
    if success:
        events = json.loads(getattr(user, 'events'))
        events.remove(event_id)
        setattr(user, 'events', json.dumps(events))
        db.session.commit()
        return {'message': 'cancel successful'},200
    else:
        return {'message': 'cancel failed'},500

if __name__ == '__main__':
    app.run(debug = True, host="0.0.0.0", port=8080)
    # app.run(debug=True)
