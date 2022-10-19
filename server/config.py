import os

# environ.get(key, default) -> 환경변수에 key가 없으면 default값 리턴

mysql_config = {
	'host': os.environ.get('MYSQL_HOST', 'localhost'),
	'user': os.environ.get('MYSQL_USER', 'root'),
	'pass': os.environ.get('MYSQL_PASS', ''),
	'db':   os.environ.get('MYSQL_DB', 'my_flask'),
}

def alchemy_uri():
	return 'mysql://%s:%s@%s/%s?charset=utf8' % (
		mysql_config['user'], mysql_config['pass'], mysql_config['host'], mysql_config['db']
	)

