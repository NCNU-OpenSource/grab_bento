import dateutil.parser as parser
from datetime import datetime

def toDtObject(dt_string):
	date = parser.parse(dt_string)
	return datetime.fromisoformat(date.isoformat())
