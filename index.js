/**
 * 说明: 启动入口文件;
 *
 * 执行命令: node index.js "{\"url\":\"http:\/\/localhost:8080\/XVIEW\/\",\"client_id\":\"hkbank\",\"date\":\"20170930\",\"portfolioId\":\"HKB0001\",\"lastDate\":\"\",\"type\":\"\"}"
 *
 * 测试命令2: node index.js "{\"url\":\"http:\/\/localhost:8080\/XVIEW\/\",\"client_id\":\"999888\",\"date\":\"20170630\",\"portfolioId\":\"811025\",\"lastDate\":\"\",\"type\":\"\"}"
 *
 * 测试命令3: node index.js "{\"url\":\"http:\/\/localhost:8080\/XVIEW\/\",\"client_id\":\"lzbank\",\"date\":\"20171130\",\"portfolioId\":\"LZB0001\",\"lastDate\":\"\",\"type\":\"\"}"
 * 参数 :
 * {
 *   url:'http://localhost:8080/XVIEW3.2/',
 *   client_id:'hkbank',
 *   date:'20170930',
 *   portfolioId:'HKB0001',
 *   lastDate:'',
 *   type:''
 * }
 *
 *
 * **/

var fs = require('fs');
var path = require('path');
var process = require('process');
//var execFile  = require('child_process').execFile ;
var child_process = require('child_process');
var async = require('async');
var empty = require('./common/emptyDir');
var config = require("./config")
var params = JSON.parse(process.argv[2]);
var url = __dirname + '/management';


config.log("开始生成组合投后PDF图片:");
config.log(process.argv);

if(typeof params == 'string'){
    params = JSON.parse(params);
}
var dateNow = new Date();
params.now = dateNow.getTime();
//删除用户文件夹
function removeDir(path) {

    var files = fs.readdirSync(path);

    if(files && files.length){
        files.forEach(function (file) {
            if(file.indexOf('.js') == -1){
                //获取文件状态
                var stats = fs.statSync(url+ '/'+file);
                if(!stats.isDirectory()){
                    //直接删除
                    fs.unlinkSync(url+'/'+file);
                }else{
                    removeDir(url+'/'+file);//回调
                }
            }
        })
    }
}

//创建用户文件夹
function createDir() {

    fs.mkdir(url+'/'+params.now+params.client_id+'_'+params.date,function (err) {
        if(err && err.code != 'EEXIST'){
            console.log('创建文件失败!');
            console.log(err);
        }else{
            //empty.emptyDir(url+'/'+ params.client_id+'_'+params.date);
            fs.mkdir(url+'/'+params.now+ params.client_id+'_'+params.date+'/'+params.portfolioId,function (err) {
                if(err && err.code != 'EEXIST'){
                    console.log('创建文件失败!');
                    console.log(err);
                }else{
                    empty.emptyDir(url+'/'+params.now+ params.client_id+'_'+params.date+'/'+params.portfolioId);
                }
            });
        }
    });
    
    var files = fs.readdirSync(url);
    if(files && files.length){
        files.forEach(function (file) {
            var stats = fs.statSync(url+ '/' + file);
            /*fs.rmdir(url+'/'+file, function (err) {
                if(err){
                    console.log(err);
                }
            })*/
            if(stats && stats.isDirectory()){
                fs.exists(url + '/' + file,function (exists) {
                    if(!exists){
                        fs.mkdir(url+'/'+params.now+ params.client_id+'_'+params.date,function (err) {
                            if(err){
                                console.log('创建文件失败!');
                                console.log(err);
                                return;
                            }
                        });
                    }else{
                        empty.emptyDir(url+'/'+file);
                    }
                })
            }
        });
    }
}

(function execInit() {
    //创建文件夹
    createDir();

    //异步读取dir
    fs.readdir(url,function (err,files) {
        if(err){
            console.log(err);
        }
        var files = files;
        if(files && files.length){

            files.forEach(function (file,index) {
                var i = index;
                fs.exists(url + '/' + file,function (exists) {
                    if(exists){
                        var stats = fs.statSync(url + '/' + file);
                        var suffix = file.split('.')[1];

                        if(stats.isFile() && suffix == 'js'){
                            //stdio:'inherti'
                            var child = child_process.fork(url+'/'+file,{silent:true});

                            //传递参数
                            child.send(params);

                            //子进程输出
                            child.stdout.setEncoding('utf8');
                            child.stdout.on('data', function(data){
                                console.log(data.toString());
                            });
                            child.stderr.on('data', function(data){
                                console.log('stderr:',data.toString());
                            });

                            //子进程退出码
                            child.on('close',function (code) {
                                //console.log('子进程已输入输出关闭，退出码:'+code);
                            });

                            child.on('exit',function (code) {
                                //console.log('子进程已退出，退出码:'+code);
                            });

                        }
                    }
                });
            })
        }
    });

})();





