/**
 * 生成echarts,highcharts 图片 模块
 * **/
var fs = require('fs');
var node_echarts = require('node-echarts');
const exporter = require('highcharts-export-server');
var _ = require('underscore');

module.exports = {
    //支持多个,单个图片导出;
    echartImg: function (option,path,name,imgType,width,height) {
        imgType = imgType || 'png'
        name = name || 'ec';
        if(_.isArray(option) && option.length){
            _.each(option,function (item,index) {
                console.log(path + name[index] + '.' + imgType);
                var t = item.baseMutiple || 3;
                new node_echarts({
                    path: path + name[index] + '.' + imgType,
                    option: item,
                    width: t*width || 1000,
                    height: t*height || 420,
                    devicePixelRatio:2
                });
            });
        }else if(_.isObject(option)){
            var t = option.baseMutiple || 3;
            console.log(path + name + '.' + imgType);
            new node_echarts({
                path: path + name + '.' + imgType,
                option: option ,
                width: t*width || 1000,
                height: t*height || 420,
                devicePixelRatio:2
            });
        }

    },

    //只支持单个highcharts图片;
    highchartImg: function (option,path,name,imgType,callback) {
        name = name || 'hc';
        imgType = imgType || 'jpg';

        exporter.initPool();
        exporter.export(option, function(err, res) {
            if(err){console.log(err);}

            if(res.data){
                console.log( path + name + '.' + imgType);
                var buff = new Buffer(res.data,'base64');
                fs.writeFileSync(path + name + '.' + imgType,buff);
            }else{
                console.log('该类型匹配不到数据!');
            }

            exporter.killPool();
            callback();
        });
    }
}
