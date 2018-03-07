/**
* page: 债券池--委托看券
* 
* 启动命令: node entrustExport.js "{\"user_id\":\"ych800\",\"date\":\"20180122\",\"infoCodeList\":[\"031784009.IB\",\"031770014.IB\",\"112611.SZ\"]}" 
*
* 图片路径: 当前文件夹下/images/ 
*
* requsetUrl: entrustBond/findPdfExport
*	
* requsetData: List<String> infoCodeList
*
* method: post  
**/

var request = require('request');
var http = require('http');
var async = require('async');
var process = require('process');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var empty = require('../common/emptyDir');
var create = require('../common/createImg');
var config = require("../config");

//var infoCodeList = process.argv[2] || [];
var params = JSON.parse(process.argv[2]);
var baseUrl = process.argv[3] || config.MainUrl;
config.log('开始生成 委托报表图片:');
config.log(process.argv)

if(typeof params == 'string'){
    params = JSON.parse(params);
}

var infoCodeList = params.infoCodeList || [];
var imagesUrl = __dirname + '/images/'+params.user_id + '_' + params.date +'/';
var baseTimes = 3;


//pie 
var pie_option = {
    title : {
    
    },

    tooltip : {
        /*trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"*/
    },
    color:['#3465BF','#EC782A','#A5A5A5','#FFC000','#5B9BD5','#70AD47','#C9C9C9','#F8CBAD'],
    legend: {
        orient: 'horizontal',
        left: 'center',
        bottom:10*baseTimes,
        textStyle:{
        	fontSize:28,
        	color:'#000'
        },
        data: []
    },
 
    series : [
        {
            name: '',
            type: 'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[],
            label:{
            	normal:{
            		formatter:'{c}',
            		fontSize:24,
            		color:'#000'
            	}
            }
        }
    ]
};

//bar
var bar_option = {
    title: {
        
    },
    tooltip: {
        
    },
    legend: {
        
    },
    color:['#337ab7'],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        //boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        axisLabel:{
            rotate:45
        },
        data: []
    },
    series: [
        {
            name: '',
            type: 'bar',
            barWidth:30*baseTimes,
            data:[],
            label:{
                normal:{
                    show:true,
                    color:'#000',
                    position:'top',
                    fontSize:28
                }
            }
        }
    ]
};


function createPieImg (data,key,imageName,isPercent){
	pie_option.legend.data = [];
	pie_option.series[0].data = [];

	if(data && data.length){
		_.each(data,function(item){
			pie_option.legend.data.push(item[key]);
			pie_option.series[0].data.push({
				name: item[key],
				value: item.count
			});
		});
	}

	if(isPercent){
		pie_option.series[0].label.normal.formatter = '{d}%';
	}else{
		pie_option.series[0].label.normal.formatter = '{c}';
	}

	create.echartImg(pie_option,imagesUrl,imageName,'jpg',260,220);
}

function createBarImg (data,key,imageName){
	bar_option.xAxis.data = [];
	bar_option.series[0].data = [];

	if(data && data.length){
		_.each(data,function(item){
			bar_option.xAxis.data.push(item[key]);
			bar_option.series[0].data.push(item.count);
		});
	}
    if(data.length >12){
        bar_option.series[0].barWidth = 15*baseTimes;
    }
	create.echartImg(bar_option,imagesUrl,imageName,'jpg',580,220);
}

//获取数据;
async.waterfall([
    //创建文件
    function(callback){
        fs.mkdir(imagesUrl,function (err) {
            if(err && err.code != 'EEXIST'){
                console.log('创建文件失败!');
                console.log(err);
            }else{
                empty.emptyDir(imagesUrl);
            }

            callback(null,imagesUrl);
        });
    },

    //执行导出;
    function(path, callback){
        //获取数据;
        request.post({
            url: baseUrl + 'entrustBond/findPdfExport?auth_skip=auto_login',
            json:{
                "infoCodeList": infoCodeList//JSON.parse(infoCodeList)//["031784009.IB","031770014.IB","112611.SZ","101766009.IB","011751106.IB","111781637.IB","041560061.IB","031490606.IB","111788361.IB"]
            },
        },function(err,res,data){
            if(err){ 
            	console.log(err);
            	callback(err);
            }else if(res.statusCode == 200){
                //主体评分,行业,企业属性
                var bodyRate = data.data.pdfBodyRate;
                var bodyIndustry = data.data.PdfBodyIndustry;
                var compNature = data.data.pdfBondCompNature;
                //_bondIndustry_pie.jpg    _bondRate_pie.jpg    _bodyIndustry2_bar.jpg  _bodyIndustry_pie.jpg   _bodyRate_pie.jpg
                //导出主体图片
                createPieImg(bodyRate,'cib_rating','_bodyRate_pie',true);
                createPieImg(compNature,'comp_nature','_bodyIndustry_pie',true);
                createBarImg(bodyIndustry,'industry_type','_bodyIndustry2_bar');

                //债券评分,行业,企业属性
                var bondRate = data.data.pdfBondRate;
                var bondIndustry = data.data.pdfBondIndustry;
                //导出债券图片
                createPieImg(bondRate,'cib_bond_rating','_bondRate_pie',true);
                createPieImg(bondIndustry,'info_type','_bondIndustry_pie',true);
                //createBarImg(bondIndustry,'info_type','_bond_industry_bar');
                
                callback(null,'all is done');
            }else{
            	callback("接口获取数据失败, " +res.statusCode);
            }
        });

    }

],function(err,result){
    if(err){
    	console.log("委托报告图片生成失败, "+err);
        config.log("委托报告图片生成失败, "+err);
    }
    //console.log(result);
    process.exit(1);
})

