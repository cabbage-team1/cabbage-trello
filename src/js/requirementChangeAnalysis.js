let cardsInfo = [];
let labelSet = [];
let dataSet = {};

const t = window.TrelloPowerUp.iframe();

var echarts = require('echarts');
const _ = require("lodash");
var chartDom = document.getElementById('charts');
var myChart = echarts.init(chartDom);
var option;
var histogramDom = document.getElementById('histogram');
var myHistogram = echarts.init(histogramDom);
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    dataset: {
        dimensions: ['product', '2015', '2016', '2017'],
        source: [
            {product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7},
            {product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1},
            {product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5},
            {product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1}
        ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: [{type: 'bar'}, {type: 'bar'}]
};


t.board('labels').then(res => {
    const _ = require('lodash');
    labelSet = _.filter(res.labels, label => label.name !== '');
});
let itemsProcessed = 0;
t.cards('id', 'labels', 'name', 'dateLastActivity')
    .then(cards => {
        cards.forEach((cardInfo, index, array) => {
            t.get(cardInfo.id, 'shared', 'requirementChangeCount')
                .then(requirementChangeCount => {
                    cardsInfo = [...cardsInfo, {...cardInfo, requirementChangeCount}];
                })
                .then(() => {
                    itemsProcessed++;
                    if (itemsProcessed === array.length) {
                        drawPieChart();
                        drawHistogram();
                    }
                });
        });
    });

onConfirm = () => {
    const _ = require('lodash');
    const moment = require('moment');
    const start_data_value = document.getElementById("start-date").value;
    const end_data_value = document.getElementById("end-date").value;
    const period_value = document.getElementById("period").value;
    if (!start_data_value || !end_data_value || !period_value) {
        window.prompt("参数输入不完整，请补全参数");
        return;
    }
    if (!moment(start_data_value).isBefore(moment(end_data_value))) {
        window.prompt("开始日期晚于结束日期，请补全参数");
        return;
    }
    if (period_value <= 0) {
        window.prompt("周期输入有误");
        return;
    }
    drawHistogram(start_data_value, end_data_value, period_value);
}

drawHistogram = (start_data_value, end_data_value, period_value) => {
    const _ = require('lodash');
    const moment = require('moment');
    let source = [['cycle', 'cards count', 'changes count']];
    const period = period_value ? _.toNumber(period_value) : 14;
    const startDate = _.isEmpty(start_data_value) ? moment().local().endOf('week').subtract(14 * 6, 'days') : moment(start_data_value);
    const endDate = _.isEmpty(end_data_value) ? moment().local().endOf('week') : moment(end_data_value);
    let periodEndPivot = endDate.endOf('week');
    while (startDate.isBefore(periodEndPivot)) {
        const periodEnd = _.cloneDeep(periodEndPivot);
        const periodStart = periodEndPivot.subtract(period, 'days');
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            return periodEnd.isAfter(dateLastActivityOfCard) && periodStart.isBefore(dateLastActivityOfCard);
        });
        const cardCount = list.length;
        let changeCount = 0;
        _.forEach(list, singleCard => {
            const singleCount = _.get(singleCard, 'requirementChangeCount', 0);
            changeCount += singleCount;
        });
        source = [...source, [`${periodStart.format('MM/DD')} ~ ${periodEnd.format('MM/DD')}`, cardCount, changeCount]];
    }
    const histogramOption = generateHistogramOption(source);
    myHistogram.setOption(histogramOption);
}

generateHistogramOption = source => {
    const _ = require('lodash');
    const labels = _.drop(source).map(data => data[0]);
    const histogramOption = {
        color: ['#d3f998', '#59c276'],
        legend: {
            show: false
        },
        tooltip: {},
        grid: {
            top: '20%'
        },
        dataset: {
            source: [
                ['cycle', 'cards count', 'changes count'],
                ['cycle1', 7, 17],
                ['cycle2', 3, 34],
            ]
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisTick: {},
            axisLabel: {
                show: true,
            }
        },
        yAxis: {},
        series: [{type: 'bar'}, {type: 'bar'}],
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'slider'
            }
        ],
    };
    histogramOption.dataset.source = source;
    return histogramOption;
}

drawPieChart = () => {
    const _ = require('lodash');
    console.log('cardsInfo: ', cardsInfo);
    _.forEach(labelSet, label => {
        const list = _.filter(cardsInfo, cardInfo => {
            return _.find(cardInfo.labels, singleLabel => singleLabel.name === label.name)
        });
        dataSet = {...dataSet, [label.name]: list};
    });
    console.log('dataSet: ', dataSet);
    const data = calculateRequirementChangeCountAndCardCountAsSource(dataSet);
    console.log('pie data: ', data);
    option = generatePieChartOption(data);
    myChart.setOption(option);
}

generatePieChartOption = data => {
    const pieChartOption = {
        legend: {
            right: '10%',
            top: '7%'
        },
        grid: {
            top: '20%'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            }
        ]
    };
    pieChartOption.series[0].data = data;
    return pieChartOption;
}

calculateRequirementChangeCountAndCardCountAsSource = dataSet => {
    const _ = require('lodash');
    let data = [];
    _.forEach(dataSet, (value, key) => {
        let changeCount = 0;
        _.forEach(value, singleCard => {
            const singleCount = _.get(singleCard, 'requirementChangeCount', 0);
            changeCount += singleCount;
        });
        data = [...data, {name: key, value: changeCount}];
    })
    return data;
}
