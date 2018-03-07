var path = require("path")
var fs = require("fs")

module.exports = exports = new function(){

	var logfile =  __dirname+"/log.log"
    return {
        MainUrl: "http://192.168.4.58:8090/XVIEW",
        log: function(data){
        	fs.appendFile(logfile, new Date(), "utf-8");
        	fs.appendFile(logfile, " ", "utf-8");
        	fs.appendFile(logfile, data, "utf-8");
        	fs.appendFile(logfile, "\n", "utf-8");
        }
    }
};