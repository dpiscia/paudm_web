# pau_web [![Build Status](https://secure.travis-ci.org/dpiscia/paudm_web.png?branch=master)](http://travis-ci.org/dpiscia/paudm_web)



## Getting Started
clone the  git module with: `git clone https://github.com/dpiscia/paudm_web`

install the module dependencies

```javascript
cd paudm_web
npm install
```
Need to prepare a config.js file for DB connection
```javascript
var config = {}

config.url = "postgresql://Username:password@hostname/db_name";

module.exports = config;
```

## Documentation
_(Coming soon)_

### TRIGGER
in order to connect server to DB , some triggers have to be set on the DB side:

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

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 PAUDM-team  
Licensed under the MIT license.
