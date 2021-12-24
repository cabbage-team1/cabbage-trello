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
    console.log('labelSet: ', labelSet);
});
t.cards('id', 'labels', 'name', 'dateLastActivity')
    .then(cards => {
        console.log('cards: ', cards);
        cards.forEach(cardInfo => {
            t.get(cardInfo.id, 'shared', 'requirementChangeCount')
                .then(requirementChangeCount => {
                    console.log('requirementChangeCount: ',requirementChangeCount);
                    cardsInfo = [...cardsInfo, {...cardInfo, requirementChangeCount}];
                })
        });
        console.log('cardsInfo: ', cardsInfo);
    });

startAnalysis = () => {
    drawPieChart();
    drawHistogram();
}

drawHistogram = () => {
    const _ = require('lodash');
    const moment = require('moment');
    let source = [];
    console.log('cardsInfo: ', cardsInfo);
    for (let i = 0; i < 6; i++) {
        const twoWeeksStart = moment().local().endOf('week').subtract((i + 1) * 14, 'days');
        const twoWeeksEnd = moment().local().endOf('week').subtract(i * 14, 'days');
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            return twoWeeksEnd.isAfter(dateLastActivityOfCard) && twoWeeksStart.isBefore(dateLastActivityOfCard);
        });
        console.log('list: ', list);
        const cardCount = list.length;
        let changeCount = 0;
        _.forEach(list, singleCard => {
            const singleCount = _.get(singleCard, 'requirementChangeCount', 0);
            changeCount += singleCount;
        });
        console.log('twoWeeksStart: ', twoWeeksStart);
        console.log('twoWeeksEnd: ', twoWeeksEnd);
        console.log('cardCount and changeCount: ', cardCount, changeCount);
        source = [...source, [`${twoWeeksStart.format('MM/DD')} ~ ${twoWeeksEnd.format('MM/DD')}`, cardCount, changeCount]];
    }
    const legend = ['cycle', 'cards count', 'changes count'];
    source = [legend, ..._.reverse(source)];
    const histogramOption = generateHistogramOption(source);
    myHistogram.setOption(histogramOption);
}

generateHistogramOption = source => {
    const _ = require('lodash');
    const labels = _.drop(source).map(data => data[0]);
    const histogramOption = {
        color: ['#d3f998', '#59c276'],
        title: {
            text: 'Requirement Changes Statistics',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
        legend: {
            right: '10%',
            top: '10%'
        },
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
            axisTick: {
                alignWithLabel: true,
                interval: '0'
            },
            axisLabel: {
                show: true,
                interval: '0'
            }
        },
        yAxis: {},
        series: [{type: 'bar'}, {type: 'bar'}]
    };
    histogramOption.dataset.source = source;
    console.log('source: ', source);
    return histogramOption;
}

drawPieChart = () => {
    const _ = require('lodash');
    _.forEach(labelSet, label => {
        const list = _.filter(cardsInfo, cardInfo => {
            return _.find(cardInfo.labels, singleLabel => singleLabel.name === label.name)
        });
        dataSet = {...dataSet, [label.name]: list};
    });
    const data = calculateRequirementChangeCountAndCardCountAsSource(dataSet);
    option = generatePieChartOption(data);
    myChart.setOption(option);
}

generatePieChartOption = data => {
    const pieChartOption = {
        title: {
            text: 'Total Number of Requirement Changes by Labels',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
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
