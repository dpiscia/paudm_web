# pau_web [![Build Status](https://secure.travis-ci.org/dpiscia/paudm_web.png?branch=master)](http://travis-ci.org/dpiscia/paudm_web)

Data visualization (tree data-structure) web app

## Getting Started
clone the  git module with: `git clone https://github.com/dpiscia/paudm_web`

install the module dependencies

```javascript
cd paudm_web
npm install
```
You need to prepare a config.js file for DB connection, the dbs have to be two in sqlite mode ,
and can be only one in postgres.

If you run grunt, then two sqlite db files will be created in test folder, you can eventually use these dbs as starting point
```javascript
var config = {}
//if postgresql use the below config scheme
config.job = {client : "pg" , host : "host name", user : "user" , password : "pwd" , name : "db_name" }; 

config.pau= {client : "pg" , host : "host name", user : "user" , password : "pwd" , name : "db_name" }; 
//if sqlite use the scheme belowe
config.job = {client : "pg", name : "url/db_name"};
config.pau = {client : "pg", name : "url/db_name"};
module.exports = config;
```

## Documentation


### Triggers
in order to synchronize server to DB , some triggers have to be set on the DB side (it works only with postgresql) :

this sync is incompatible with two phase commits transaction. 
In this situation an alternative
can be represented by using REDIS as message broker.

```javascript

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watchers', TG_OP ||  ',id,' || NEW.id );
  RETURN new;
END;
$$ LANGUAGE plpgsql;
```

```javascript
CREATE TRIGGER watched_table_trigger AFTER INSERT ON job 
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
```
```javascript
CREATE TRIGGER update_table_trigger AFTER UPDATE ON job 
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
```

```javascript
CREATE FUNCTION old_notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watchers', TG_OP ||  ',id,' || OLD.id );
  RETURN new;
END;
$$ LANGUAGE plpgsql;

```
```javascript
CREATE TRIGGER delete_table_trigger AFTER DELETE ON job 
FOR EACH ROW EXECUTE PROCEDURE old_notify_trigger();
```
## Testing

install grunt:

npm install -g grunt-cli


testing can be done by typing:
```shell
grunt
```

Basic server side test coverage is provided, but it is far from optimal/complete.

##Continue Testing

Continue testing is done through Travis-ci https://travis-ci.org/dpiscia/paudm_web

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
pre-release(pre-vacations) v 0.0.1 

release (almost) v 0.1

https://github.com/dpiscia/paudm_web/releases

## License
Copyright (c) 2013 PAUDM-team  
Licensed under the MIT license.
