/**
 *  page: 组合投后--产品首页
 *  图形: highcharts, echarts ;
 *  启动命令: node productHomepage.js 999888 20170930 811025;
 *  参数说明:
 *  client_id: "hkbank"
 *  date: "20170930"
 *  portfolioId: "HKB0001"
 *  url: http://localhost:8080/XVIEW3.2/
 * **/

var request = require('request');
var http = require('http');
var async = require('async');
var process = require('process');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');
var create = require('../common/createImg');

var config = require("../config");
var baseUrl = config.MainUrl;

var reqUrl = [{url:'pfl/findProductDetails?auth_skip=auto_login',type:'ec'},{url:'pfl/findPerformanceTrend?auth_skip=auto_login',type:'hc'}];
var baseMutiple = 3;
var weightList = [];
/** highcharts **/
var exportSettings = {
    type: 'jpg',
    width: 300 * baseMutiple,
    //height: 300,//插件不支持高度设置:
    constr: 'Chart',//==>1. StockChart: highstock;  2. Chart:highcharts;

    options:{
        chart:{
            marginTop:70,
            marginBottom:40,
        },
        title: {
            text: ''
        },
        legend: {
            enabled: 'true',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 0,
            itemStyle: {color: '#000',fontSize:'14px'}
        },
        rangeSelector:{
            enabled:false
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
                /*formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }*/
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
        scrollbar:{
            height: 0,
            show:false
        },
        navigator: {
            height:25,
            xAxis: {
                labels: {
                    x: -20,
                    format: '{value:%Y-%m-%d}',
                    style:{color:'#000'}
                    /*formatter: function () {
                        return moment(new Date(this.value)).format('YYYY-MM');
                    }*/
                },
            },
            series: {
                //data: data
            }
        },
        series: [
            {
                name: '',//$scope.detailList.typeName,
                data: [],//data[0].data,
                color:"#1790cf",
                marker:{
                    enabled:false
                },
                lineWidth:1
            },
            {
                //name: "中债总财富指数(037.cs)",
                name: "基准线",
                data: [],//data[1].data,
                color:"#f25a5a",
                marker:{
                    enabled:false
                },
                lineWidth:1
            }
        ]
    }

}

/** echarts **/
//管理能力分析
var option1 = {
    noDataLoadingOption :{
        text: '暂无数据',
        effect:'bubble',
        effectOption : {
            effect: {
                n: 0 //气泡个数为0
            }
        }
    },
    "baseMutiple":2,
    "legend": {
        "show":true,
        "right": 'center',
        "bottom": 7*baseMutiple,
        textStyle:{
            color:"#000"
        },
        "data":[]
    },
    "grid": {},
    "xAxis": {
        "show": false
    },
    "yAxis": {
        "show": false,
        axisLabel:{
            color:'#000',
            textStyle:{
                color:'#000'
            }
        },
    },
    "series": [
        {
            "type": "radar",
            "data": [
                {
                    "value": [],
                    "name": '',
                    "itemStyle": {
                        "normal": {
                            "color": "#1790cf"
                        }
                    }
                },
                {
                    "value": [],
                    "name": "平均",
                    "itemStyle": {
                        "normal": {
                            "color": "#f25a5a"
                        }
                    }
                }
            ]
        }
    ],
    "title": {
        show: false,
        text: '暂无数据'
    },
    "radar": {
        "indicator": [],
        "name": {
            "textStyle": {
                "color": "black"
            }
        },
        "radius": "50%"
    }
}

//业绩归因
var option2 = {
    noDataLoadingOption :{
        text: '暂无数据',
        effect:'bubble',
        effectOption : {
            effect: {
                n: 0 //气泡个数为0
            }
        }
    },
    "baseMutiple":2,
    title: {
        show:false,
        text: '暂无数据',
    },
    xAxis: {
        type : 'value',
        axisLabel: {
            show: true,
            formatter: '{value}',
            color:'#000'
        },
        /*max:perMax,
         min:perMin*/
    },
    grid:{
        left:"15%",
        right:"8%",
        y:10*baseMutiple,
        y2:15*baseMutiple
    },
    yAxis: {
        type : 'category',
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
            color:'#000',
            textStyle: {
               // fontSize: 14,
                color:'#000'
            }
        },
        data : []//data.performanceAttributionName
    },
    series : [
        {
            type:'bar',
            barWidth: 15 * baseMutiple,
            //barCategoryGap: '500%',
            data: []//data.performanceAttributionValue
        }
    ]
}

//资产配置
var option3 = {
    noDataLoadingOption :{
        text: '暂无数据',
        effect:'bubble',
        effectOption : {
            effect: {
                n: 0 //气泡个数为0
            }
        }
    },
    "baseMutiple":2,
    title: {
        show:false,
        //text: '市值占组合资产权重',
        text: '暂无数据'
    },
    grid: {
        x: 40*baseMutiple,
        y: 15*baseMutiple,
        y2:35*baseMutiple,
        x2:40*baseMutiple
    },
    xAxis: {
        type : 'value',
        axisLabel: {
            show: true,
            formatter: '{value}%',
            color:"#000"
        },
        /*max:locMax,
         min:locMin*/
    },
    yAxis: {
        type : 'category',
        axisLine: {show: true},
        axisTick: {show: false},
        axisLabel: {
            color:'#000'
        },
        data : []//$scope.localListName.reverse()
    },
    series : [
        {
            name:"权重",
            type:'bar',
            stack: '总量',
            barWidth: 15 *baseMutiple,
            barCategoryGap: 5,
            color:"#000",
            //barCategoryGap: '500%',
            itemStyle: {
                normal: {
                    color: '#48b7c7',
                }
            },
            label:{
                normal:{
                    show:true,
                    position:"right",
                    formatter:'{c}%',
                    textStyle:{
                        color:"#000"
                    }
                }
            },
            data:[]// data.reverse()
        }
    ]
};

//风险分布
var option4 = {
    noDataLoadingOption :{
        text: '暂无数据',
        effect:'bubble',
        effectOption : {
            effect: {
                n: 0 //气泡个数为0
            }
        }
    },
    "baseMutiple":2,
    "xAxisField": "date",
    "title": {
        show:false,
        text: '暂无数据',
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
        "x2": 20*baseMutiple,
        "y": 20*baseMutiple,
        "y2": 35*baseMutiple
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
            min: 0,
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
            "barWidth": 25*baseMutiple,
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

/** 加载数据 **/
var typeName = "";

//清空images文件夹
//empty.emptyDir(__dirname + '/images');
process.on('message',function (msg) {
    if(msg.url){
        baseUrl = msg.url;
    }
    async.eachSeries(reqUrl,function(item,callback){
        //清空数据:
        exportSettings.options.series[0].data = [];
        exportSettings.options.series[0].name = '';
        exportSettings.options.series[1].data = []

        option1.legend.data = [];
        option1.radar.indicator = [];
        option1.series[0].data[0].value = [];
        option1.series[0].data[1].value = [];

        option2.yAxis.data = [];
        option2.series[0].data = [];

        option3.series[0].data = [];
        option3.yAxis.data = [];

        option4.xAxis[0].data = [];
        option4.series[0].data = [];
        option4.series[1].data = [];

        request.post({
            url:baseUrl + item.url,
            json:{
                client_id: msg.client_id,
                date: msg.date,
                portfolioId: msg.portfolioId
            }
        },function (err,res,data) {
            if(err){ 
                callback(err);
            }else if(res.statusCode == 200){
                /** echarts **/
                if(item.type == 'ec'){
                    typeName = (data.detailList && data.detailList.length) ? data.detailList[0].typeName : "";
                    weightList = data.weightList;
                    //管理能力分析
                    option1.legend.data = [typeName,'平均'];
                    if(data.mixedAbilityList && data.mixedAbilityList.length){
                        for(var i = 0,l = data.mixedAbilityList.length;i<l;i++){
                            var obj = {name:''+ data.mixedAbilityList[i].measure_name, max: 100,min:0};
                            option1.radar.indicator.push(obj);
                            option1.series[0].data[0].value.push(data.mixedAbilityList[i].measure_value);
                            option1.series[0].data[1].value.push(data.mixedAbilityList[i].measure_avg);
                        }
                    }else{
                        option1.radar.indicator = ['','','','','',''];
                    }
                    option1.series[0].data[0].name = typeName;

                    //业绩归因
                    option2.yAxis.data = _.pluck(data.performanceAttribution,"measure_name") || [];

                    var lists = _.pluck(data.performanceAttribution,"measure_value") || [];
                    var fontColor = ["#1790cf","#ffa6a6","#1790cf","#ffa6a6","#1790cf"];
                    for (var i = 0; i < lists.length; i++) {
                        if (lists[i]) {
                            lists[i] = lists[i];
                        }
                        if (data.performanceAttribution[i].type_name) {
                            option2.series[0].data.push({
                                typeName: data.performanceAttribution[i].type_name,
                                value: lists[i],
                                itemStyle: {
                                    normal: {
                                        color: '#f7ad34'
                                    }
                                },
                                label:{
                                    normal:{
                                        show:true,
                                        textStyle:{
                                            color:"#000"
                                        }
                                    }
                                }
                            })
                        }else{
                            option2.series[0].data.push({
                                typeName: data.performanceAttribution[i].type_name,
                                value: lists[i],
                                itemStyle: {
                                    normal: {
                                        color: fontColor[i]
                                    }
                                },
                                label:{
                                    normal:{
                                        show:true,
                                        textStyle:{
                                            color:"#000"
                                        }
                                    }
                                }
                            })
                        }
                        if(option2.series[0].data[i].value>0){
                            option2.series[0].data[i].label.normal.position="right";
                        }else{
                            option2.series[0].data[i].label.normal.position="right";
                        }
                    }

                    //资产配置
                    option3.series[0].data = _.pluck(data.localAssetsDeployCaseList,"market_weight") || [];
                    option3.yAxis.data = _.pluck(data.localAssetsDeployCaseList,"assets_situation") || [];
                    var height = option3.yAxis.data.length * (15 + 5 * 2)+ 100 <=125 ? 125 : option3.yAxis.data.length * (15 + 5 * 2)+ 100;

                    //风险分布

                    option4.xAxis[0].data = [];
                    option4.series[0].data = [];
                    option4.series[1].data = [];

                    var leftY  = _.pluck(data.ratingWeightList,'scale_proportion') || [];
                    var rightY = _.pluck(data.ratingWeightList,'modified_duration')|| [];

                    /*leftMin = Math.min.apply(null,leftY);
                    leftMax = Math.max.apply(null,leftY);

                    rightMin = Math.min.apply(null,rightY);
                    rightMax = Math.max.apply(null,rightY);

                    if(leftMin < 0){
                        rightMin = leftMin* rightMax/leftMax;
                    }*/

                    /*var min1 = Math.floor(leftMin/10)*10;
                    var max1 = (Math.floor(leftMax/10)+1)*10;

                    var min2 = min1 == 0 ? 0:rightMin * min1 / leftMin;
                    var max2 = rightMax * max1 / leftMax;*/

                    option4.xAxis[0].data = _.pluck(data.ratingWeightList,'rating');
                    option4.series[0].data = leftY;
                    option4.series[1].data = rightY;

                    /*option4.yAxis[0].min = 0;
                    option4.yAxis[0].max = max1;
                    option4.yAxis[1].min = 0;
                    option4.yAxis[1].max = max2;*/



                    var cur = msg.client_id+'_'+msg.date;
                    var imgNames = ['_ec1_'+cur,'_ec2_'+cur,'_ec4_'+cur];
                    //暂无数据
                    if(option4.series[0].data.length && option4.series[0].data.length){
                        create.echartImg(option4, __dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_ec4_'+cur,'jpg',500,280);
                    }

                    if(option3.series[0].data.length){
                        create.echartImg(option3, __dirname +'/'+msg.now+msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_ec3_'+cur,'jpg',500,height);
                    }

                    if(option2.series[0].data.length && option2.yAxis.data.length){
                        create.echartImg(option2, __dirname +'/'+msg.now+ msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_ec2_'+cur,'jpg',500,280);
                    }

                    if(option1.series[0].data[0].value.length && option1.series[0].data[1].value.length){
                        create.echartImg(option1, __dirname +'/'+msg.now+ msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_ec1_'+cur,'jpg',500,280);
                    }

                    callback();
                }

                /** highcharts **/
                if(item.type == 'hc'){

                    //本期业绩;
                    var weight_one = weightList[0].weight_one*1 || 100;
                    var weight_two = weightList[0].weight_two*1 || 0;

                    var growth_decline_arr = data[1].data || []; //评价期区间中债总财富指数涨跌幅
                    var total_wealth_arr = data[2].data || []; //评价期区间沪深300涨跌幅
                    var performance_benchmark = [];

                    // 业绩基准 算法
                    if(growth_decline_arr.length == 0 || total_wealth_arr.length == 0){
                       
                    }else{
                        for(var i=0;i<growth_decline_arr.length;i++){
                            var v = growth_decline_arr[i];
                            performance_benchmark.push([v[0],(weight_one/100*v[1] + weight_two/100*total_wealth_arr[i][1]).toFixed(4) * 1]);
                        }
                    }

                    exportSettings.options.series[0].data = data[0].data || [];
                    exportSettings.options.series[1].data = performance_benchmark;
                    exportSettings.options.series[0].name = typeName;

                    create.highchartImg(exportSettings,__dirname +'/'+msg.now+ msg.client_id+'_'+msg.date + '/'+msg.portfolioId+'/','_hc_'+msg.client_id+'_'+msg.date,'jpg',callback);

                }

            }else{
                callback(res.statusCode)
            }
        });
    },function (err) {
        if(err){
            config.log('A file failed to process, '+ err);
        }
        process.exit();
    })
})
