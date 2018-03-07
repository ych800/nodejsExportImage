/**
 *  page: 组合投后--产品综合评分
 *  图形: highcharts, echarts ;
 *  命令调用: node productScoring.js hkbank 20170930
 *  参数说明(顺序):
 *  client_id = hkbank,
 *  date = 20170930
 */

var request = require('request');
var http = require('http');
var async = require('async');
var process = require('process');
var path = require('path');
var fs = require('fs');
//var empty = require('../common/emptyDir');
var create = require('../common/createImg');
var config = require("../config");
var baseUrl = config.MainUrl;
var baseMutiple = 3;

//highcharts options:
var exportSettings = {
    type: 'jpg',
    width: 560*baseMutiple,
    //height: 550,//插件不支持高度设置:
    constr: 'Chart',//==>1. StockChart: highstock;  2. Chart:highcharts;

    options: {
        title: {
            text: '产品累计净值表',
            align:'left',
            y:5,
            textStyle:{
                color:"#000"
            }
        },
        chart: {
            marginTop: 200,
            marginBottom: 40,
        },
        legend: {
            enabled: 'true',
            align: 'center',
            verticalAlign: 'top',
            layout: 'vertical',
            margin:50,
            itemStyle: { color: '#000',fontSize:'14px' },
            labelFormatter: function() {
                /*if (this.name.length > 10) {
                 return this.name.substring(0, 10) + "...";
                 }*/
                return this.name;
            }
        },
        rangeSelector: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 180,
            labels: {
                format: '{value:%Y-%m-%d}',
                rotation: 0,
                style:{
                    color:'#111',
                    fontSize:'12px'
                }
            }
        },
        yAxis: {
            plotLines: [{
                value: 0,
                width: 2,
                color: '#000'
            }],
            title: {
                text: ''
            },
            labels: {
                enabled: true,
                format:'{value}%',
                align: "right",
                style:{
                    color:'#111',
                    fontSize:'12px'
                }
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            },
            spline: {
                lineWidth: 0.2,
            },
        },
        scrollbar: {
            height: 0,
            show:false
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            // valueDecimals: 2,
            xDateFormat: "%Y-%m-%d"
        },
        navigator: {
            height: 20,
            xAxis: {
                labels: {
                    x: -20,
                    format: '{value:%Y-%m-%d}',
                    style:{
                        color:'#000',
                        fontSize:'14px'
                    }
                },
            },
            series: {
                data: []
            }
        },
        series: []
    }
};

//echarts  options:
var option = {
    xAxisField:'date',
    title:{
        show:false,
        text:''
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "line",
            lineStyle: {
                color: "#1790cf",
                type: "dashed"
            },
            data: [1, 2, 3]
        },
        show: false
    },
    color:['#2c909e','#48b7c7','#71baa8','#fabf45','#ac8cbc','#9dbf5b','#e99826','#4caf50','#983d1b','#3f51b5'],
    legend: {
        selectedMode: true,
        bottom: 15,
        //top:15,
        align: "left",
        textStyle:{
            color:'#000'
        },
        tooltip: {
            show: true
        },
        data: []
    },
    grid: {x: 30*baseMutiple, x2: 20*baseMutiple, y: 20*baseMutiple, y2: 60*baseMutiple},
    xAxis: [
        {
            type: "category",
            boundaryGap: true,
            show: true,
            splitNumber: 5,
            offset: 8*baseMutiple,
            axisLabel: {
                color:'#000',
                formatter:function (value,index) {
                    //return echarts.format.truncateText(name ? name : '', 80, '14px Microsoft Yahei', '…');
                    return '产品'+(index+1);
                }
            },
            data: []
        }
    ],
    yAxis: [
        {
            name: "得分",
            nameLocation: "end",
            nameGap:20,
            nameTextStyle:{
                color:'#000'
            },
            color:'#000',
            type: "value",
            axisLabel: {
                formatter: "{value}",
                color:'#000'
            }
        },
        {
            show: false,
            name: "",
            nameLocation: "end",
            nameTextStyle:{
                color:'#000'
            },
            type: "value",
            axisLabel: {
                formatter: "{value}",
                color:'#000',
                fontWeight:'bold'
            },
            splitLine: {
                "show": false
            }
        }
    ],
    series: []
}


var searchType = [
    {
        type:'zhpf',
        title:'综合评分',
        score:[
            {title:'收益评分',key:'yield_score'},
            {title:'风险评分',key:'risk_score'},
            {title:'投研评分',key:'touyan_score'},
            {title:'综合评分',key:'colligate_score'}
        ]
    },
    {
        type:'sypf',
        title:'收益评分',
        score:[
            {title:'收益率', key:'sy'},
            {title:'sharpe', key:'sy1'},
            {title:'最大回折', key:'sy2'},
            {title:'Hurst', key:'sy3'},
            {title:'收益评分', key:'yield_score'}
        ]
    },
    {
        type:'fxpf',
        title:'风险评分',
        score:[
            {title:'持有债券信用事件', key:'fy1'},
            {title:'当前持仓债券主体加权信用评分', key:'fy5'},
            {title:'持仓不变部分债券主体评级下调', key:'fy4'},
            {title:'换仓部分债券主体评级变化', key:'fy3'},
            {title:'信用风险调整后久期', key:'fy2'},
            {title:'相关债券信用事件', key:'fy6'},
            {title:'收益偏离同等级债券规模占比', key:'fy'},
            {title:'风险评分', key:'risk_score'}
        ]
    },
    {
        type:'typf',
        title:'投研评分',
        score:[
            {title:'交易能力', key:'ty'},
            {title:'信用择时能力', key:'ty1'},
            {title:'选券择时能力', key:'ty2'},
            {title:'投研评分', key:'touyan_score'}
        ]
    }
];

//清空images 文件夹
//empty.emptyDir(__dirname+'/images');

process.on('message',function (msg) {
    //console.log(msg);
    if(msg.url){
        baseUrl = msg.url;
    }
    async.eachSeries(searchType,function(item,callback){
        //echart title
        option.title.text = item.title;

        //requset data
        request.post({
                url: baseUrl + 'pfl/findTypeScore?auth_skip=auto_login',
                json: {
                    typeScore: item.type,
                    client_id: msg.client_id,
                    date: msg.date,
                    pageSize:1000,
                    pageNum: 1
                }
            },
            function(err,res,body){
                //清空数据:
                option.xAxis[0].data = [];
                option.legend.data = [];
                option.series = [];
                exportSettings.options.series = [];//highcharts

                if(err){
                    callback(err);
                }else if(res.statusCode == 200){
                    //console.log('响应成功!');

                    //legend.data
                    for(var i = 0;i<item.score.length-1;i++){
                        option.legend.data.push({
                            icon: "pin",
                            name: item.score[i].title
                        });
                    }
                    //xAxis[0].data
                    option.xAxis[0].data= body.findProductList;

                    //series
                    var arr = body[item.type];
                    if(arr && arr.length){
                        for(var i=0;i<item.score.length;i++){
                            if(i<=item.length-2){
                                option.series.push({
                                    barWidth: 35*baseMutiple,
                                    name: item.score[i].title,
                                    type: "bar",
                                    stack: "1",
                                    label: {
                                        normal: {
                                            show: true,
                                            position: "inside",
                                            textStyle: {
                                                color: "#fff",
                                                fontWeight:'bold'
                                            }
                                        }
                                    },
                                    data: []
                                });
                            }else{
                                option.series.push({
                                    barWidth: 35 *baseMutiple,
                                    name: item.score[i].title,
                                    type: "bar",
                                    stack: "1",
                                    label: {
                                        normal: {
                                            show: true,
                                            position: "top",
                                            formatter:function (params) {
                                                return params.data.oValue;
                                            },
                                            textStyle: {
                                                color: "#000",
                                                fontWeight:'bold'
                                            }
                                        }
                                    },
                                    data: []
                                });
                            }
                            for(var j=0;j<arr.length;j++){
                                var score = 0;
                                if(i <= item.score.length-2){
                                    score = (arr[j][item.score[i].key] / (item.score.length -1)).toFixed(2);
                                    option.series[i].data.push({
                                        date: arr[j].portfolio_name,
                                        value: score ,
                                        label: {
                                            normal: {
                                                position: "inside",
                                                color:'#fff',
                                                fontWeight:'bold'
                                            }
                                        },
                                    });
                                }else{
                                    score = arr[j][item.score[i].key];
                                    option.series[i].data.push({
                                        date: arr[j].portfolio_name,
                                        value: 0,
                                        label: {
                                            normal: {
                                                position: "top",
                                                color:'#000',
                                                fontWeight:'bold'
                                            }
                                        },
                                        oValue: score
                                    });
                                }
                            }
                        }
                        var imgPath =  __dirname +'/'+msg.now+ msg.client_id+'_'+msg.date + '/';
                        var imgName = '_'+item.type+'_'+msg.client_id+'_'+msg.date;
                        var imgType = 'jpg';
                        if(option.xAxis[0].data.length && option.legend.data.length){
                            create.echartImg(option,imgPath,imgName,imgType,580,300);
                        }

                    }else{
                        console.log('数据为空!');
                    }


                    //生成 highcharts image
                    if(item.type == 'zhpf'){
                        var colors = ['#4D80BF','#C3504B','#9DBE57','#8061A4','#47ACC8','#F9A04E','#2B4C77','#772C27','#637931','#392f41'];
                        var names = body.findProductList;

                        if(names && names.length){
                            for(var i=0;i<names.length;i++){
                                exportSettings.options.series.push({
                                    name: names[i] ,
                                    data: body['product'+i] ,
                                    marker:{
                                        enabled:false
                                    },
                                    color: colors[i],
                                    lineWidth: 1
                                });
                            }
                            exportSettings.options.chart.marginTop = 19*names.length + 30;
                        }
                        var hcImgPath = __dirname +'/'+msg.now+ msg.client_id+'_'+msg.date + '/';
                        var hcImgName = '_zhpfHc_'+'_'+msg.client_id+'_'+msg.date;
                        var hcImgType = 'jpg';
                        if(item.type == 'fxpf'){
                            option.grid.y2 = 100*baseMutiple;
                        }

                        if(names.length>5){
                            exportSettings.options.legend.itemStyle.fontSize = '8px';
                            exportSettings.options.chart.marginTop = 12*names.length + 30;
                        }

                        create.highchartImg(exportSettings,hcImgPath,hcImgName,hcImgType,callback);
                    }else{
                        callback();
                    }
                }else{
                    console.log('获取信息失败!');
                    callback("获取信息失败");
                }
            }
        )
    },function (err) {
        if(err){
            config.log('A file failed to process, '+ err);
        }
        //console.log('All file have been processed successfully');
        process.exit();
        
    })
})





