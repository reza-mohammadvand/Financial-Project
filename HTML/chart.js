
// Create Charts
function createChart(chartId, volumeData, timeData, priceData, maData, emaData, rsiData) {

    var total = volumeData.reduce((a, b) => a + b, 0);
    var average = volumeData.length > 0 ? total / volumeData.length : 5000;  // Set a default 
    
    var numDataPoints = 15; // The number of data points
    var pointWidth = 80; // The width of each data point in px
    document.getElementById(chartId).width = numDataPoints * pointWidth;
    
    const myChart = new Chart(chartId, {
      type: "bar",
      data: {
        labels: timeData, // This will be populated with your time data
        datasets: [{
          label: 'price',
          data: priceData, // This will be populated with your price data
          borderColor: 'rgba(75,192,192,1)',
          type: 'line',
          lineTension: 0,
          pointRadius: 3,
          pointBorderWidth: 4,
          fill: true,
        }, {
          label: 'MA',
          data: maData, // This will be populated with your moving average data
          borderColor: 'rgba(192,75,192,1)',
          type: 'line',
          lineTension: 0,
          pointRadius: 3,
          pointBorderWidth: 4,
          fill: true,
        }, {
          label: 'EMA',
          data: emaData, // This will be populated with your EMA data
          borderColor: 'rgba(192,192,75,1)',
          type: 'line',
          lineTension: 0,
          pointRadius: 3,
          pointBorderWidth: 4,
          fill: true,
        }, {
          label: 'RSI',
          data: rsiData, // This will be populated with your RSI data
          borderColor: 'rgba(75,75,192,1)',
          type: 'line',
          lineTension: 0,
          pointRadius: 3,
          pointBorderWidth: 4,
          fill: true,
        },{
          label: 'Volume',
          data: volumeData, // This will be populated with your volume data
          type: 'bar',
          backgroundColor: 'rgba(0,0,0,0.4)',
          yAxisID: 'y-axis-volume',
          order: 1,
          barPercentage: 0.3,
          lineTension: 0,
          pointRadius: 3,
          pointBorderWidth: 4,
          fill: true,
        }
      ]
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'right', // Change this to 'left' to move the price axis to the left
            id: 'y-axis-1',
          }, 
          {
            id: 'y-axis-volume',
            type: 'linear',
            display: false, // Set this to false to hide the volume axis
            position: 'right',
            gridLines: {
              drawOnChartArea: false
            },
            ticks: {
              min: average / 2, // half the average
              max: average * 4, // forth the average
            }
          }   
        ],
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel;
              return label;
            },
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              enabled: true,
              mode: 'xy',
              drag: false,
              wheel: true
            }          
          }
        }
        ,
        legend: {
          display: true, // Hide the default legend
              },
      }
    });
    
    return myChart;
    }
    
    // Initialize empty arrays
    var AAPLvolumeData = [];
    var AAPLtimeData =[];
    var AAPLpriceData = [];
    var AAPLmaData =[];
    var AAPLemaData = [];
    var AAPLrsiData = [];
    
    var GOOGLvolumeData = [];
    var GOOGLtimeData = [];
    var GOOGLpriceData = [];
    var GOOGLmaData = [];
    var GOOGLemaData = [];
    var GOOGLrsiData = [];
    
    var AMZNvolumeData = [];
    var AMZNtimeData = [];
    var AMZNpriceData = [];
    var AMZNmaData = [];
    var AMZNemaData = [];
    var AMZNrsiData = [];
    
    var MSFTvolumeData = [];
    var MSFTtimeData = [];
    var MSFTpriceData = [];
    var MSFTmaData = [];
    var MSFTemaData = [];
    var MSFTrsiData = [];
    
    var TSLAvolumeData = [];
    var TSLAtimeData = [];
    var TSLApriceData = [];
    var TSLAmaData = [];
    var TSLAemaData = [];
    var TSLArsiData = [];
    
    // Function to add data
    function addData(chart, label, priceData, maData, emaData, rsiData, volumeData) {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(priceData);
      chart.data.datasets[1].data.push(maData);
      chart.data.datasets[2].data.push(emaData);
      chart.data.datasets[3].data.push(rsiData);
      chart.data.datasets[4].data.push(volumeData);
      chart.update();
    }
    
    // Usage:
    var AAPL_chart = createChart('AAPL-chart', AAPLvolumeData, AAPLtimeData, AAPLpriceData, AAPLmaData, AAPLemaData, AAPLrsiData);
    var GOOGL_chart = createChart('GOOGL-chart', GOOGLvolumeData, GOOGLtimeData, GOOGLpriceData, GOOGLmaData, GOOGLemaData, GOOGLrsiData);
    var AMZN_chart = createChart('AMZN-chart', AMZNvolumeData, AMZNtimeData, AMZNpriceData, AMZNmaData, AMZNemaData, AMZNrsiData);
    var MSFT_chart = createChart('MSFT-chart', MSFTvolumeData, MSFTtimeData, MSFTpriceData, MSFTmaData, MSFTemaData, MSFTrsiData);
    var TSLA_chart = createChart('TSLA-chart', TSLAvolumeData, TSLAtimeData, TSLApriceData, TSLAmaData, TSLAemaData, TSLArsiData);
    
    
    
    
    
    // go to end of chart
    function scrollToChartEnd() {
    var elements = document.getElementsByClassName("chartWrapper");
    for (var i = 0; i < elements.length; i++) {
      elements[i].scrollLeft = elements[i].scrollWidth;
    }
    }
    scrollToChartEnd()
    
    
    
    
    
    // small chart
    function createSmallChart(chartId, priceData, timeData) {
    var last10Prices = priceData.slice(-15);
    var last10Labels = timeData.slice(-15);
    
    const mysmallChart = new Chart(chartId, {
        type: "line",
        data: {
            labels: last10Labels,
            datasets: [{
                label: 'price',
                data: last10Prices,
                borderColor: 'rgba(75,192,192,1)',
                type: 'line',
                categoryPercentage: 2,
                lineTension: 0,
                pointRadius: 3,
                pointBorderWidth: 4,
                fill: true,
            }]
        },
        options: {
          responsive: false,
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value, index, values) {
                  return '';
                }
              }
            }],
            yAxes: [{
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-axis-1',
            }],
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                  label += ': ';
                }
                label += tooltipItem.yLabel;
                return label;
              },
            }
          },
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: 'x'
              },
              zoom: {
                enabled: true,
                mode: 'x'
              }
            }
          },
          legend: {
            display: false // Hide the default legend
          },
        }
      });
    
    return mysmallChart;
    }
    
    // Usage:
    var AAPLsmallChart = createSmallChart('AAPLsmallChart', AAPLpriceData, AAPLtimeData);
    var GOOGLsmallChart = createSmallChart('GOOGLsmallChart', GOOGLpriceData, GOOGLtimeData);
    var AMZNsmallChart = createSmallChart('AMZNsmallChart', AMZNpriceData, AMZNtimeData);
    var MSFTsmallChart = createSmallChart('MSFTsmallChart', MSFTpriceData, MSFTtimeData);
    var TSLAsmallChart = createSmallChart('TSLAsmallChart', TSLApriceData, TSLApriceData);
    
    

    