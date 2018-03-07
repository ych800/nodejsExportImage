var echarts = require("echarts");
var Canvas = require("canvas-prebuilt");
var fs     = require('fs');
var path   = require('path');


//Canvas.registerFont(path.join(path.dirname(require.main.filename), "../font", "STFANGSO.ttf"), "STFANGSO")
const  fontSize = '28px';
 var configTheme = {
     "color": [
         "#f25a5a",
         "#1790cf",
         "#1dc3ed",
         "#68b9f5",
         "#99ccff",
         "#a5e7f0",
         "#7e949e",
         "#7ed8a6",
         "#fbf18d",
         "#e4a1f6",
         "#ce668a",
         "#f7bcd0",
         "#dfdfe6",
         "#9ea9d7",
     ],
     "backgroundColor": "#ffffff",
     "textStyle": {
         'fontSize': fontSize ,
         'color': '#738790'
     },
     "title": {
         "show":false,
         "textStyle": {
             "color": "#000",
             "fontSize": 30,
             "fontWeight":'bold',
             "width": '500%',
             "height":70,
         },
         "subtextStyle": {
             "color": "#000"
         },
         //"left":10,
         //right:10,
         //"borderRadius":10,
         "width":'100%',
         "padding":[15,3000,15,10],
         "backgroundColor":'#DDEAFB',
         "shadowColor": 'rgba(0, 0, 0, 0.5)',
         "shadowBlur": 10,
         "shadowOffsetY":-2
     },
     "line": {
         "itemStyle": {
             "normal": {
                 "borderWidth": "2",
                 label:{
                     textStyle:{
                         fontSize:fontSize
                     }
                 }
             }
         },
         "lineStyle": {
             "normal": {
                 "width": "2"
             }
         },
         "symbolSize": "6",
         "symbol": "emptyCircle",
         "smooth": true
     },
     "radar": {
         "itemStyle": {
             "normal": {
                 "borderWidth": "2",
                 label:{
                     textStyle:{
                         fontSize:fontSize
                     }
                 }
             }
         },
         "lineStyle": {
             "normal": {
                 "width": "2"
             }
         },
         "symbolSize": "6",
         "symbol": "emptyCircle",
         "smooth": true
     },
     "bar": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "barBorderWidth": 0,
                 "barBorderColor": "#cccccc",
             },
             "emphasis": {
                 "barBorderWidth": 0,
                 "barBorderColor": "#cccccc"
             }
         }
     },
     "pie": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "scatter": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "boxplot": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "parallel": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "sankey": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "funnel": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "gauge": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             },
             "emphasis": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         }
     },
     "candlestick": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "color": "#edafda",
                 "color0": "transparent",
                 "borderColor": "#d680bc",
                 "borderColor0": "#8fd3e8",
                 "borderWidth": "2"
             }
         }
     },
     "graph": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "borderWidth": 0,
                 "borderColor": "#cccccc"
             }
         },
         "lineStyle": {
             "normal": {
                 "width": 1,
                 "color": "#aaaaaa"
             }
         },
         "symbolSize": "6",
         "symbol": "emptyCircle",
         "smooth": true,
         "color": [
             "#f25a5a",
             "#1790cf",
             "#1dc3ed",
             "#99ccff",
             "#a5e7f0",
             "#7e949e"
         ],
         "label": {
             "normal": {
                 "textStyle": {
                     "color": "#eeeeee",
                     fontSize: fontSize
                 }
             }
         }
     },
     "map": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "areaColor": "#f3f3f3",
                 "borderColor": "#516b91",
                 "borderWidth": 0.5
             },
             "emphasis": {
                 "areaColor": "rgba(165,231,240,1)",
                 "borderColor": "#516b91",
                 "borderWidth": 1
             }
         },
         "label": {
             "normal": {
                 "textStyle": {
                     "color": "#000000",
                     fontSize:fontSize
                 }
             },
             "emphasis": {
                 "textStyle": {
                     "color": "rgb(81,107,145)"
                 }
             }
         }
     },
     "geo": {
         label:{
             normal:{
                 textStyle:{
                     fontSize:fontSize,
                     color:'#000'
                 }
             }
         },
         "itemStyle": {
             "normal": {
                 "areaColor": "#f3f3f3",
                 "borderColor": "#516b91",
                 "borderWidth": 0.5
             },
             "emphasis": {
                 "areaColor": "rgba(165,231,240,1)",
                 "borderColor": "#516b91",
                 "borderWidth": 1
             }
         },
         "label": {
             "normal": {
                 "textStyle": {
                     "color": "#000000",
                     fontSize:fontSize
                 }
             },
             "emphasis": {
                 "textStyle": {
                     "color": "rgb(81,107,145)"
                 }
             }
         }
     },
     "categoryAxis": {
         "axisLine": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisTick": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisLabel": {
             "show": true,
             "textStyle": {
                 "color": "#000",
                 fontSize:fontSize
             }
         },
         "splitLine": {
             "show": true,
             "lineStyle": {
                 "color": [
                     "#efefef"
                 ]
             }
         },
         "splitArea": {
             "show": false,
             "areaStyle": {
                 "color": [
                     "rgba(250,250,250,0.05)",
                     "rgba(200,200,200,0.02)"
                 ]
             }
         }
     },
     "valueAxis": {
         "axisLine": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisTick": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisLabel": {
             "show": true,
             "textStyle": {
                 "color": "#000",
                 fontSize:fontSize
             }
         },
         "splitLine": {
             "show": true,
             "lineStyle": {
                 "color": [
                     "#efefef"
                 ]
             }
         },
         "splitArea": {
             "show": false,
             "areaStyle": {
                 "color": [
                     "rgba(250,250,250,0.05)",
                     "rgba(200,200,200,0.02)"
                 ]
             }
         }
     },
     "logAxis": {
         "axisLine": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisTick": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisLabel": {
             "show": true,
             "textStyle": {
                 "color": "#000",
                 fontSize:fontSize
             }
         },
         "splitLine": {
             "show": true,
             "lineStyle": {
                 "color": [
                     "#efefef"
                 ]
             }
         },
         "splitArea": {
             "show": false,
             "areaStyle": {
                 "color": [
                     "rgba(250,250,250,0.05)",
                     "rgba(200,200,200,0.02)"
                 ]
             }
         }
     },
     "timeAxis": {
         "axisLine": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisTick": {
             "show": true,
             "lineStyle": {
                 "color": "#1790cf"
             }
         },
         "axisLabel": {
             "show": true,
             "textStyle": {
                 "color": "#000",
                 fontSize:fontSize
             }
         },
         "splitLine": {
             "show": true,
             "lineStyle": {
                 "color": [
                     "#efefef"
                 ]
             }
         },
         "splitArea": {
             "show": false,
             "areaStyle": {
                 "color": [
                     "rgba(250,250,250,0.05)",
                     "rgba(200,200,200,0.02)"
                 ]
             }
         }
     },
     "toolbox": {
         "iconStyle": {
             "normal": {
                 "borderColor": "#999999"
             },
             "emphasis": {
                 "borderColor": "#666666"
             }
         }
     },
     "legend": {
         "textStyle": {
             "color": "#000",
             "fontSize":fontSize
         }
     },
     "xAxis":{
         "nameTextStyle":{
             "fontSize": fontSize,
             "color": '#000'
         },
         "nameGap":25,
         "axisLabel":{
             "fontSize": fontSize,
             "color": "#333"
         }
     },
     "yAxis":{
         "nameTextStyle":{
             "fontSize": fontSize,
             "color": '#000'
         },
         "nameGap":30,
         "axisLabel":{
             "fontSize": fontSize,
             "color": "#333"
         }
     },
     "tooltip": {
         "axisPointer": {
             "lineStyle": {
                 "color": "#1790cf",
                 "width": "1",
                 "type":"dashed"
             },
             "crossStyle": {
                 "color": "#cccccc",
                 "width": "1"
             }
         }
     },
     "timeline": {
         "lineStyle": {
             "color": "#8fd3e8",
             "width": 1
         },
         "itemStyle": {
             "normal": {
                 "color": "#8fd3e8",
                 "borderWidth": 1
             },
             "emphasis": {
                 "color": "#8fd3e8"
             }
         },
         "controlStyle": {
             "normal": {
                 "color": "#8fd3e8",
                 "borderColor": "#8fd3e8",
                 "borderWidth": 0.5
             },
             "emphasis": {
                 "color": "#8fd3e8",
                 "borderColor": "#8fd3e8",
                 "borderWidth": 0.5
             }
         },
         "checkpointStyle": {
             "color": "#8fd3e8",
             "borderColor": "rgba(138,124,168,0.37)"
         },
         "label": {
             "normal": {
                 "textStyle": {
                     "color": "#8fd3e8"
                 }
             },
             "emphasis": {
                 "textStyle": {
                     "color": "#8fd3e8"
                 }
             }
         }
     },
     "visualMap": {
         "color": [
             "#516b91",
             "#59c4e6",
             "#a5e7f0"
         ]
     },
     "dataZoom": {
         "backgroundColor": "rgba(0,0,0,0)",
         "dataBackgroundColor": "rgba(255,255,255,0.3)",
         "fillerColor": "rgba(167,183,204,0.4)",
         "handleColor": "#a7b7cc",
         "handleSize": "100%",
         "textStyle": {
             "color": "#333333"
         }
     },
     "markPoint": {
         "label": {
             "normal": {
                 "textStyle": {
                     "color": "#eeeeee"
                 }
             },
             "emphasis": {
                 "textStyle": {
                     "color": "#eeeeee"
                 }
             }
         }
     }
 }


/**
 * @param config = {
        width: 图表宽度
        height: 图表高度
        option: echarts配置
        path:  生成文件路径
    }
 *
*/
module.exports = function(config){
    if(config.canvas){
        Canvas = config.canvas;
    }
    echarts.setCanvasCreator(function () {
        return ctx;
    });
    var ctx = new Canvas(128, 128);
    var chart,option = {
            title: {
                text: 'test'
            },
            tooltip: {},
            legend: {
                data:['test']
            },
            xAxis: {
                data: ["a","b","c","d","f","g"]
            },
            yAxis: {},
            series: [{
                name: 'test',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
    config.width = config.width || 500;
    config.height = config.height || 500;
    config.option = config.option || option;
    config.path = config.path || process.cwd() + '/test.png';
    if(config.font){
        ctx.font = config.font;
    }else{
    	ctx.font="STFANGSO"
    }
    
    config.option.animation = false;
    chart = echarts.init(new Canvas(parseInt(config.width,10), parseInt(config.height,10)),configTheme,config);
    chart.setOption(config.option);
    try{
        var c = chart.getDom();
        // c.width = config.width * 3;
        // c.height = config.height * 3;
        fs.writeFileSync(config.path, c.toBuffer(undefined,0));
        console.log("Create Img:" +config.path)
    }catch(err){
        console.error("Error: Write File failed" + err.message)
    }   
}
