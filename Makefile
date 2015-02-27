BIN = "./node_modules/.bin/"

jshint:
	@ $(BIN)jshint jayce.js test/*.js

test: jshint
	@ $(BIN)mocha
	
benchs:
	@ node bench/run.js
	
build:
	@ $(BIN)uglifyjs jayce.js -o jayce.min.js -c -m
	
