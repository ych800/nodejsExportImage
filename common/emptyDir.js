/**
 * 清空文件夹中内容
 **/

var fs = require('fs');

function  emptyDir(url) {
    //读取文件中内容
    var files = fs.readdirSync(url);

    if(files && files.length){
        files.forEach(function (file) {
            //获取文件状态
            var stats = fs.statSync(url+ '/'+file);

            if(!stats.isDirectory()){
                //直接删除
                fs.unlinkSync(url+'/'+file);
            }else{
                //emptyDir(url+'/'+file);//回调
            }
        })
    }
}

//导出模块
exports.emptyDir = emptyDir;