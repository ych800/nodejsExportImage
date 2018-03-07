/**
 *  page: 组合投后--产品详情页
 *  图形: highcharts, echarts ;
 *  启动命令: node productDetail.js 20170930 HKB0001 '';
 *  参数说明:
 *  date:"20170630"
 *  portfolioId:"811025"
 *  lastDate:"20170531"
 *  type: null (该参数不传)
 * **/

var request = require('request');
var http = require('http');
var async = require('async');
var process = require('process');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var create = require('../common/createImg');

var config = require("../config");
var baseUrl = config.MainUrl;
var baseMutiple = 3;

/**  echarts options **/

/************** 目前在持资产配置 (通用) ****************/
//市场占组合资产配置,
//配置收益资产类别
var option_com = {
    baseMutiple:2,
    title: {
        show:false,
        text: '暂无数据',
        textStyle: {
        },
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                type: 'dashed'
            }
        },
        formatter: function(data){
            if(datas.length == 0){
                return;
            }
            var pic = '<span style="display:inline-block;width: 10px;height:10px;background:'+ data[0].color +';border-radius:50%;vertical-align:middle;"></span>'
            return pic + ' ' + data[0].name + ':' + data[0].value + '%';
        }
    },
    grid: {
        x: 70*baseMutiple,
        y: 10*baseMutiple,
        x2: 35*baseMutiple,
        y2: 20*baseMutiple
    },
    xAxis: {
        type : 'value',
        axisLabel: {
            show: true,
            formatter: '{value}%',
            color:'#000',
            textStyle:{
                color:'#000'
            }
        }
    },
    yAxis: {
        type : 'category',
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
            color:'#000',
            textStyle: {
                //fontSize: 14*3,
                color:'#000'
            }
        },
        data : []//dataType.reverse()
    },
    series : [
        {
            name:'权重',
            type:'bar',
            stack: '总量',
            barWidth: 15*baseMutiple,
            barCategoryGap: 2,
            itemStyle: {
                normal: {
                    color: '#69A7F2'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    textStyle: {
                        color: '#000'
                    }
                }
            },
            data: []//dataValue.reverse()
        }
    ]
};

/****************** 组合主体评级权重 ******************/
var option_subject = {
    "xAxisField": "date",
    baseMutiple:2,
    "legend": {
        "selectedMode": true,
        "bottom": 8*baseMutiple,
        "align": "left",
        textStyle:{
            color:'#000'
        },
        "tooltip": {
            "show": true
        },
        "data": [
            {
                "icon": "pin",
                "name": "占债券组合的权重"
            },
            {
                "icon": "pin",
                "name": "久期"
            }
        ],
        "show": true
    },
    "grid": {
        "x": 47*baseMutiple,
        "x2": 30*baseMutiple,
        "y": 20*baseMutiple,
        "y2": 40*baseMutiple
    },

    "xAxis": [
        {
            "type": "category",
            "boundaryGap": true,
            axisLabel:{
                color:'#000',
                textStyle:{
                    color:'#000'
                }
            },
            "data": []
        }
    ],
    "yAxis": [
        {
            type: 'value',
            scale: true,
            name: '占债券组合的权重',
            max: 100,
            min: 0,
            "nameLocation": "end",
            nameGap:20,
            nameTextStyle:{
                color:'#000'
            },
            axisLabel: {
                type : 'value',
                formatter: function(value){
                    return value.toFixed(2) + '%';
                },
                textStyle:{
                    color:'#000'
                }

            },
            boundaryGap: [0.2, 0.2]
        },
        {
            type: 'value',
            scale: true,
            name: '久期',
            min:0,
            "nameLocation": "end",
            splitLine:{
                show:false
            },
            nameGap:20,
            nameTextStyle:{
                color:'#000'
            },
            axisLabel: {
                type : 'value',
                formatter: function(value){
                    return Math.ceil(value);
                },
                textStyle:{
                    color:'#000'
                }

            },
            boundaryGap: [0.2, 0.2]
        }
    ],
    "series": [
        {
            "name": "占债券组合的权重",
            "barWidth": 15*baseMutiple,
            "decimal": 2,
            "type": "bar",
            "color": "#97BAF4",
            "lineStyle": {
                "normal": {
                    "width": 1
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    "position": "top",
                    "formatter":function (params) {
                        return params.value + '%';
                    },
                    "textStyle": {
                        "color": "#000"
                    }
                }
            },
            "itemStyle": {
                "normal": {
                    "color": "#97BAF4"
                }
            },
            "data": []
        },
        {
            "name": "久期",
            "decimal": 2,
            "type": "line",
            "color": "#F7AD34",
            //"field": "modified_duration",
            "yAxisIndex": 1,
            "itemStyle": {
                "normal": {
                    "color": "#F7AD34"
                }
            },
            "data": []
        }
    ]
}

/********************* 债券行业占比 ********************/
//规模占比
var option_scale = {
    baseMutiple:2,
    "xAxisField": "date",
    "title":{
        show:false,
        //"text":'规模占比',
        text:'暂无数据'
    },
    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "line",
            "lineStyle": {
                "color": "#1790cf",
                "type": "dashed"
            },
            "data": [1, 2, 3],
            "axis": "y"
        },
        "show": true
    },
    "legend": {
        "selectedMode": true,
        "bottom": 8*baseMutiple,
        "align": "left",
        textStyle:{
            color:'#000'
        },
        "tooltip": {
            "show": true
        },
        "data": [
            "其他规模占比",
            "AA规模占比",
            "AA+规模占比",
            "AAA规模占比"
        ],
        "show": true
    },
    "grid": {
        "x": 20*baseMutiple,
        "x2": 20*baseMutiple,
        "y": 20*baseMutiple,
        "y2": 32*baseMutiple,
        "containLabel": true
    },
    "xAxis": [
        {
            "type": "value",
            "boundaryGap": false,
            "name": "(%)",
            nameTextStyle:{
                color:'#000'
            },
            axisLabel:{
                color:'#000',
                textStyle:{
                    color:'#000'
                }
            },
        }
    ],
    "yAxis": [
        {
            "name": "",
            "nameLocation": "end",
            "type": "category",
            "axisLabel": {
                "formatter": "{value}",
                color:'#000'
            },
            "data": []
        },
        {
            "show": false,
            "name": "",
            "nameLocation": "end",
            "type": "value",
            "axisLabel": {
                "formatter": "{value}"
            },
            "splitLine": {
                "show": false
            }
        }
    ],
    "series": [
        {
            "name": "AA+规模占比",
            "type": "bar",
            "barWidth": 15*baseMutiple,
            "barCategoryGap": 2,
            "stack": "规模占比",
            "itemStyle": {
                "normal": {
                    "color": "#71BAA6"
                }
            },
            "data": [
                {
                    "value": 5.2,
                    "marketValue": 0.0849
                }
            ]
        }
    ]
}
//收益率
var option_rate = {
    baseMutiple:2,
    "xAxisField": "date",
    "title":{
        show:false,
        //"text":'收益率',
        text:'暂无数据',
    },
    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "line",
            "lineStyle": {
                "color": "#1790cf",
                "type": "dashed"
            },
            "data": [1, 2, 3],
            "axis": "y"
        },
        "show": true
    },
    "legend": {
        "selectedMode": true,
        "bottom": 8*baseMutiple,
        "align": "left",
        textStyle:{
            color:'#000'
        },
        "tooltip": {
            "show": true
        },
        "data": [

        ],
        "show": false
    },
    "grid": {
        "x": 20*baseMutiple,
        "x2": 20*baseMutiple,
        "y": 20*baseMutiple,
        "y2": 20*baseMutiple,
        "containLabel": true
    },
    "xAxis": [
        {
            "type": "value",
            "boundaryGap": false,
            "name": "(%)",
            nameTextStyle:{
              color:'#000'
            },
            "axisPointer": {
                "triggerTooltip": false
            },
            axisLabel:{
                color:'#000',
                textStyle:{
                    color:'#000'
                }
            },
        }
    ],
    "yAxis": [
        {
            "name": "",
            "nameLocation": "end",
            "type": "category",
            "axisLabel": {
                "formatter": "{value}",
                color:'#000'
            },
            "data": []
        },
        {
            "show": false,
            "name": "",
            "nameLocation": "end",
            "type": "value",
            "axisLabel": {
                "formatter": "{value}"
            },
            "splitLine": {
                "show": false
            }
        }
    ],
    "series": [
        {
            "type": "bar",
            "barWidth": 15*baseMutiple,
            "barCategoryGap": 2,
            "itemStyle": {
                "normal": {
                    "color": "#2D909C"
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    "textStyle": {
                        "color": "#000"
                    },
                    formatter:'{c}%',
                    "position": "right"
                }
            },
            "data": []
        }
    ]
}
//久期
var option_duration = {
    baseMutiple:2,
    "xAxisField": "date",
    "title":{
        "show":false,
        //"text":'久期'
        text:'暂无数据'
    },
    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "line",
            "lineStyle": {
                "color": "#1790cf",
                "type": "dashed"
            },
            "data": [1, 2, 3],
            "axis": "y"
        },
        "show": true
    },
    "legend": {
        "selectedMode": true,
        "bottom": 8*baseMutiple,
        "align": "left",
        "tooltip": {
            "show": true
        },
        textStyle:{
            color:'#000'
        },
        "data": [

        ],
        "show": false
    },
    "grid": {
        "x": 20*baseMutiple,
        "x2": 20*baseMutiple,
        "y": 20*baseMutiple,
        "y2": 17*baseMutiple,
        "containLabel": true
    },
    "xAxis": [
        {
            "type": "value",
            "boundaryGap": false,
            "name": "(年)",
            "nameTextStyle":{
                color:'#000'
            },
            "axisPointer": {
                "triggerTooltip": false
            },
            axisLabel:{
                color:'#000',
                textStyle:{
                    color:'#000'
                }
            },
        }
    ],
    "yAxis": [
        {
            "name": "",
            "nameLocation": "end",
            "type": "category",
            "nameTextStyle":{
                color:'#000'
            },
            "axisLabel": {
                "formatter": "{value}",
                color:'#000',
                textStyle:{
                    color:'#000'
                }
            },
            "data": []
        },
        {
            "show": false,
            "name": "",
            "nameLocation": "end",
            "type": "value",
            "nameTextStyle":{
                color:'#000'
            },
            "axisLabel": {
                "formatter": "{value}"
            },
            "splitLine": {
                "show": false
            }
        }
    ],
    "series": [
        {
            "type": "bar",
            "barWidth": 15*baseMutiple,
            "barCategoryGap": 2,
            "itemStyle": {
                "normal": {
                    "color": "#2D909C"
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    "textStyle": {
                        "color": "#000"
                    },
                    formatter:'{c}年',
                    "position": "right"
                }
            },
            "data": []
        }
    ]
}

/************************* 绘图 ****************************/
//(目前在持资产配置情况)
function drawAssetsImg(data,msg) {
    // [{category},{weight}]
    if(data && data.length){
        //option_com.title.text = '';
        option_com.yAxis.data = [];
        option_com.series[0].data = [];
        var height = 120;
        _.each(data,function (item) {
            if(item.type == 'weight'){
                //option_com.title.text = '市场占组合资产权重';
                option_com.yAxis.data = _.pluck(item.list,'assets_situation') || [];
                option_com.series[0].data = _.pluck(item.list,'market_weight') || [];
                height = option_com.yAxis.data.length * (15 + 2 * 2)+ 170 ;
                if(option_com.yAxis.data.length && option_com.series[0].data.length){
                    create.echartImg(option_com,__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_weight_'+msg.date+'_'+msg.portfolioId,'jpg',500,height);
                }
            }else{
                if(item.list && item.list.length){
                    height = item.list.length * (15 + 2 * 2)+ 170;
                    var arr = _.pluck(item.list,'amount') || [];
                    if(arr && arr.length){
                        _.each(arr,function (o,i) {
                            if(o < 0){
                                option_com.series[0].data.push({
                                    value: o,
                                    itemStyle: {
                                        normal: {
                                            color: '#F59797'
                                        }
                                    }
                                });
                            }else{
                                option_com.series[0].data.push({value:o});
                            }
                        })
                    }
                }
                //option_com.title.text = '配置收益资产类别';
                option_com.yAxis.data = _.pluck(item.list,'assets_situation') || [];
                if(option_com.yAxis.data.length && option_com.series[0].data.length){
                    create.echartImg(option_com,__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_category_'+msg.date+'_'+msg.portfolioId,'jpg',500,height);
                }

            }
        })
    }
}

//(债券行业占比)
function drawBondRateImg(data,msg) {
    //清空数据:
    option_scale.series = [];
    option_scale.legend.data = [];

    option_rate.series[0].data = [];
    option_rate.yAxis[0].data = [];

    option_duration.series[0].data= [];
    option_duration.yAxis[0].data = [];

    //持仓债券行业占比(页面上综合放到最上面)
    var temp = [];
    var yAxisData = [],yieldArr=[],durationArr = [],market_value = [];
    _.each(data.data4,function(item,v){
        /*if(v.industry == '综合'){
            temp = data.data4.splice(k,1);
            return false;
        }*/
        yAxisData.push(item.industry);//y轴
        yieldArr.push((item.yield*1).toFixed(2)); //收益率
        durationArr.push((item.modified_duration*1).toFixed(2)); //存续期
    });
    //data.data4 = temp.concat(data.data4);


    var qtItem = _.find(data.data4,{"industry":"其他"});
    var list = _.filter(data.data4,function(item){
        return item.industry != '其他';
    });

    if(data.data4.length <= 11){
        _.each(data.data4,function(item){
            market_value.push({value:0,market_value:item.market_value});
        });
    }else{
        var curVal = 0;
        _.each(list,function(item,index){
            if(index<=9){
                market_value.push({value:0,market_value:item.market_value});
            }else{
                curVal += item.market_value;

                if(index == list.length-1){
                    if(qtItem){
                        market_value.unshift({value:0,market_value:curVal+qtItem.market_value});
                    }else{
                        market_value.unshift({value:0,market_value:curVal});
                    }
                }
            }
        });
    }


    var ratingList = data.ratingList;
    var colors = ['#2D909C','#48B7C7','#71BAA6','#FABF45','#ac8cbc','#9dbf5b','#e99826'];

    if(ratingList && ratingList.length){
        for(var i =0;i<ratingList.length;i++){
            var arr = [];
            if(data.data4.length <= 11){
                _.each(data.data4,function(item,index){
                    var obj = {};
                    obj.value = item[ratingList[i]];
                    obj.marketValue = item.market_value / 100;
                    arr.push(obj);
                });
            }else{
                //data.data4 = qtItem ? list:data.data4;
                var curv = 0;
                var curmv = 0;

                _.each(list,function(item,index){
                    var obj = {};
                    if(index <= 9){
                        obj.value = item[ratingList[i]];
                        obj.marketValue = item.market_value / 100;
                        arr.push(obj);
                    }else{
                        curv += item[ratingList[i]];
                        curmv += item.market_value / 100;

                        if(index == list.length-1){
                            if(!qtItem){
                                arr.unshift({"value":curv,"marketValue":curmv.toFixed(2)});
                            }else{
                                arr.unshift({"value":curv+qtItem[ratingList[i]],"marketValue":(curmv+qtItem.market_value / 100).toFixed(2)});
                            }
                            
                        }
                    }
                });   
            }

            option_scale.legend.data.push(ratingList[i]+'规模占比');
            option_scale.series.push(
                {
                    name: ratingList[i]+'规模占比',
                    type: 'bar',
                    barWidth:15*baseMutiple,
                    barCategoryGap: 2,
                    stack:'规模占比',
                    itemStyle:{
                        normal: {
                            color:colors[i]
                        }
                    },
                    data: arr
                }
            );
        }
    }

    option_scale.series.push(
        {
            name: '',
            type: 'bar',
            barWidth:15*baseMutiple,
            barCategoryGap: 2,
            stack:'规模占比',
            itemStyle:{
                normal: {
                    color:'rgba(0,0,0,0)'
                }
            },
            label:{
                normal: {
                    show: true,
                    position: 'right',
                    textStyle:{
                        color:'#000',
                    },
                    color:'#000',
                    formatter:function (params) {
                        return params.data.market_value.toFixed(2) +'%';
                    }
                }
            },
            data: market_value
        }
    );

    //限制取值个数为10个 + '其他'
    if(yAxisData.length>11){
        var index = yAxisData.indexOf('其他');
        var cur1 = 0;
        var cur2 = 0;

        if(index > -1){
            cur1 = yieldArr[index];
            cur2 = durationArr[index];

            yAxisData.splice(index,1);
            yieldArr.splice(index,1);
            durationArr.splice(index,1);
        }

        var value1 = (eval(yieldArr.slice(10).join('+'))*1 + cur1*1).toFixed(2);
        var value2 = ( eval(durationArr.slice(10).join('+'))*1 + cur2*1).toFixed(2);
     
        yAxisData = ['其他'].concat(yAxisData.slice(0,10));
        yieldArr = [value1].concat(yieldArr.slice(0,10));
        durationArr = [value2].concat(durationArr.slice(0,10));
    }

    //规模占比
    option_scale.yAxis[0].data = yAxisData;
    //收益率
    option_rate.yAxis[0].data = yAxisData;
    option_rate.series[0].data = yieldArr;
    //久期
    option_duration.yAxis[0].data = yAxisData;
    option_duration.series[0].data = durationArr;

    //计算高度
    /*var chartHeight = 170;
    if(yAxisData && yAxisData.length){
        chartHeight = yAxisData.length * (15 + 2 * 2)+ 170;
    }*/

    //计算11个bar 高度;
    var chartHeight = 11 * (15 + 2 * 2)+ 170;

    //绘图
    var baseImgName = msg.date+'_'+msg.portfolioId;
    var names = ['_scale_'+baseImgName,'_rate_'+baseImgName,'_duration_'+baseImgName];
    var optionsList = [option_scale,option_rate,option_duration];
    if(option_scale.yAxis[0].data.length && ratingList.length){
        create.echartImg(optionsList[0],__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/',names[0],'jpg',500,chartHeight);
    }

    if(option_rate.series[0].data.length && option_rate.yAxis[0].data.length){
        create.echartImg(optionsList[1],__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/',names[1],'jpg',500,chartHeight);
    }

    if(option_duration.series[0].data.length && option_duration.yAxis[0].data.length){
        create.echartImg(optionsList[2],__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/',names[2],'jpg',530,chartHeight);
    }
}

//(组合主体评级权重)
function drawSubjectRateImg(data,msg) {
    //清空数据

    option_subject.xAxis[0].data = [];
    option_subject.series[0].data = [];
    option_subject.series[1].data = [];

    var leftY  = _.pluck(data,'scale_proportion') || [];
    var rightY = _.pluck(data,'modified_duration')|| [];

    /*leftMin = Math.min.apply(null,leftY);
    leftMax = Math.max.apply(null,leftY);

    rightMin = Math.min.apply(null,rightY);
    rightMax = Math.max.apply(null,rightY);

    if(leftMin < 0){
        rightMin = leftMin* rightMax/leftMax;
    }

    var min1 = Math.floor(leftMin/10)*10;
    var max1 = (Math.floor(leftMax/10)+1)*10;

    var min2 = min1 == 0 ? 0:rightMin * min1 / leftMin;
    var max2 = rightMax * max1 / leftMax;*/

    option_subject.xAxis[0].data = _.pluck(data,'rating');
    option_subject.series[0].data = leftY;
    option_subject.series[1].data = rightY;

    /*option_subject.yAxis[0].min = 0;
    option_subject.yAxis[0].max = max1;
    option_subject.yAxis[1].min = 0;
    option_subject.yAxis[1].max = max2;*/

    var name = '_subject_'+ msg.date+'_'+msg.portfolioId;
    if(leftY.length && option_subject.xAxis[0].data.length || rightY.length){
        create.echartImg(option_subject,__dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/',name,'jpg',500,com_chartHeight);
    }
}


var com_chartHeight = 0;
process.on('message',function (msg) {
    if(msg.url){
        baseUrl = msg.url;
    }
    var task = [
        {type :1,url:baseUrl +'pfl/findPflAssetAllocation?auth_skip=auto_login'},
        {type :2,url:baseUrl +'pfl/creditRisk?auth_skip=auto_login'},
    ];
    var msg = msg;
    async.eachSeries(task,function(item,callback){
        request.post({
            url: item.url,
            json:{
                date: msg.date,
                portfolioId: msg.portfolioId,
                lastDate:msg.lastDate,
                type: null
            }
        },function (err, res, data) {
            if(err){
                console.log(err);
                callback(err);
            }else if(res.statusCode == 200){
                if(item.type == 1){
                    //目前在持资产配置情况
                    var difArr = [];
                    _.each(data.configurationYieldsList,function (item) {
                        if(!_.find(data.data2,{assets_situation:item.assets_situation})){
                            difArr.push({
                                assets_situation: item.assets_situation ,
                                market_weight:0
                            })
                        }

                    })
                    var list =  data.data2.concat(difArr);
                    var weightData = _.sortBy(list,'assets_situation');
                    var categoryData = _.sortBy(data.configurationYieldsList,'assets_situation');
                    var assetsCom = [{list:categoryData,type:'category'},{list:weightData,type:'weight'}];

                    drawAssetsImg(assetsCom,msg);

                    //债券行业占比
                    drawBondRateImg(data,msg);
                    var yAxisData = [];

                    if(data && data.data4){
                        yAxisData = _.pluck(data.data4,'industry') || [];
                    }

                    //com_chartHeight = yAxisData.length * (15 + 2 * 2)+ 170;
                    com_chartHeight = 11 * (15 + 2 * 2)+ 170;
                    callback();
                }else{
                    //组合主体评级权
                    drawSubjectRateImg(data.ratingWeight,msg);
                    callback();
                }

            }else{
                callback(res.statusCode)
            }

        })
    },function (err) {
        if(err){
            config.log('A file failed to process, ' + err);
        }
        //console.log('All file have been processed successfully');
        process.exit();
    
    });

})




