
// main tabs
$( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
} );



// Clock
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
  startTime()




// accordion
var $accordion = $('.js-accordion');

// default settings
var settings = {
  // animation speed
  speed: 400,  // Changed 'Speed' to 'speed'
 
  // close all other accordion items if true
  oneOpen: false
};

var accordion = {
  // pass configurable object literal
  init: function($settings) {
    var $accordion_header = $accordion.find('.js-accordion-header');
    $accordion_header.on('click', function() {
      accordion.toggle($(this));
    });
   
    $.extend(settings, $settings);
   
    // ensure only one accordion is active if oneOpen is true
    if(settings.oneOpen && $('.js-accordion-item.active').length > 1) {
      $('.js-accordion-item.active:not(:first)').removeClass('active');
    }
   
    // reveal the active accordion bodies
    $('.js-accordion-item.active').find('> .js-accordion-body').show();
  },
  toggle: function($this) {
    var $accordion_item = $('.js-accordion-item');
         
    if(settings.oneOpen && $this[0] != $this.closest('.js-accordion').find('> .js-accordion-item.active > .js-accordion-header')[0] ) {
      $this.closest('.js-accordion')
             .find('> .js-accordion-item')
             .removeClass('active')
             .find('.js-accordion-body')
             .slideUp()
    }
   
    // show/hide the clicked accordion item
    $this.closest('.js-accordion-item').toggleClass('active');
    $this.next().stop().slideToggle(settings.speed);
  }
}

// Call the function manually whenever you need it
accordion.init({ speed: 300, oneOpen: true });





$(document).ready(function() {
  // Add click event listener to all .accordion-header elements
  $(document).on('click', '.accordion-header', function() {
    var $accordionBody = $(this).closest('.accordion-item').find('.accordion-body');

    // Close all .accordion-body elements
    $('.accordion-body').not($accordionBody).slideUp();

    // Toggle the .accordion-body element within the same .accordion-item as the clicked .accordion-header
    $accordionBody.slideToggle();
  });
});





















  // bell

function shakeBell() {
    $("#bell-icon").css({
        "animation": "rotation 0.2s linear",
        "animation-iteration-count": "5" // Run the animation 3 times
    }); // Apply the rotation animation
    setTimeout(function(){ 
        $("#bell-icon").css({
            "animation": "",
            "animation-iteration-count": ""
        }); 
    }, 1500); // Remove the animation after 1.5s (0.5s * 3)
}


var i = 1;
var badgeNum;
var badge;

function updateBadge() {
    badge = document.getElementById('badge');
    var alertNum = i++;
    
    var badgeChild = badge.children[0];
    if(badgeChild.className === 'badge-num')
        badge.removeChild(badge.children[0]);

    badgeNum = document.createElement('div'); 
    badgeNum.setAttribute('class','badge-num');
    badgeNum.innerText = alertNum;
    var insertedElement = badge.insertBefore(badgeNum, badge.firstChild); 
}

function resetNumber() {
    i = 0;
    updateBadge()
}




// notification
var notification;
var body = document.getElementsByTagName("body")[0]; // Select the first element
var visible = false;
var queue = [];

function createNotification() {
    notification = document.createElement('div');
    var btn = document.createElement('button');
    var msg = document.createElement('div');
    btn.className = 'notification-close';
    msg.className = 'notification-message';
    btn.addEventListener('click', hideNotification, false);
    notification.addEventListener('animationend', hideNotification, false);
    notification.addEventListener('webkitAnimationEnd', hideNotification, false);
    notification.appendChild(btn);
    notification.appendChild(msg);
}

function updateNotification(type, signal,symbol) {
    notification.className = 'notification notification-' + type;
    notification.style.background = "#1fb74c"
    if (signal =="Sell") {
    notification.style.background = "#e91e63"
    }
    message = "You have a new "+signal+" signal on "+symbol
    notification.querySelector('.notification-message').innerHTML = message;
}

function showNotification(type, signal,symbol) {
    if (visible) {
        queue.push([type, signal,symbol]);
        return;
    }
    if (!notification) {
        createNotification();
    }
    updateNotification(type, signal,symbol);
    body.appendChild(notification);
    visible = true;
}

function hideNotification() {
    if (visible) {
        visible = false;
        body.removeChild(notification);
        if (queue.length) {
            showNotification.apply(null, queue.shift());
        }
    } 
}





// search box
// Your list of items
var list = [["AAPL","#tabs-3"],["GOOGL","#tabs-4"],["AMZN","#tabs-5"],["MSFT","#tabs-6"],["TSLA","#tabs-7"]];

$(document).ready(function() {
  $('#searchInput').on('input', function() {
      var input = $(this).val().toLowerCase();

      // If the input is empty, hide the list
      if (input === '') {
          $('#list').hide();
          return;
      }

      var result = list.filter(item => item[0].toLowerCase().includes(input));

      // Clear the current list
      $('#list').empty();

      // Add the search results to the list
      result.forEach(item => {
          var a = $('<a>').text(item[0]).attr('href', item[1]);
          var li = $('<li>').append(a).hide().appendTo('#list').slideDown(200);
      });

      // Show the list
      $('#list').show();
  });
});






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
        type: 'line'
      }, {
        label: 'MA',
        data: maData, // This will be populated with your moving average data
        borderColor: 'rgba(192,75,192,1)',
        type: 'line'
      }, {
        label: 'EMA',
        data: emaData, // This will be populated with your EMA data
        borderColor: 'rgba(192,192,75,1)',
        type: 'line'
      }, {
        label: 'RSI',
        data: rsiData, // This will be populated with your RSI data
        borderColor: 'rgba(75,75,192,1)',
        type: 'line'
      },{
        label: 'Volume',
        data: volumeData, // This will be populated with your volume data
        type: 'bar',
        backgroundColor: 'rgba(0,0,0,0.5)',
        yAxisID: 'y-axis-volume',
        order: 1,
        barPercentage: 0.3
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
            mode: 'x'
          }
        }
      },
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


// add data to web

var ws = new WebSocket("ws://localhost:5678/")
ws.onmessage = function (event) {
    var jsonData = JSON.parse(event.data);
    // set time
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    time =  h + ":" + m + ":" + s;
    if (jsonData.hasOwnProperty('data_type')) {
          // Create elements
          var divItem = document.createElement('div');
          var divHeader = document.createElement('div');
          var pNameSymbol = document.createElement('p');
          var pSignal = document.createElement('p');
          var pClosePrice = document.createElement('p');
          var pTime = document.createElement('p');
          var iElement = document.createElement('i');
          var divBody = document.createElement('div');
          var divContents = document.createElement('div');
          var divInner = document.createElement('div');
          var pPriceOrder = document.createElement('p');
          var pQuantity = document.createElement('p');

          // Set classes
          divItem.className = 'accordion-item';
          divHeader.className = 'accordion-header';
          divBody.className = 'accordion-body';
          iElement.className = 'fa fa-chevron-down'
          iElement.ariaHidden = "true"
          divBody.style.display = "none"

          pTime.textContent = time;
          has_stock_symbol = jsonData.hasOwnProperty('stock_symbol')
          if (has_stock_symbol == true){
            var stockSymbolNode = document.createTextNode(jsonData.stock_symbol);
            pNameSymbol.appendChild(stockSymbolNode);

          }
          if(has_stock_symbol==false){
            pNameSymbol.textContent = "General";
          }

          if(jsonData.final_signal=="Buy"){
            if(has_stock_symbol){
              showNotification(null, 'Buy',jsonData.stock_symbol)
            }
            if(has_stock_symbol==false){
              showNotification(null, 'Buy',"GDP")
            }
            pSignal.textContent = 'Buy';
            divHeader.style.background = '#1fb74c';
          }
          if(jsonData.final_signal=="Sell"){
            if(has_stock_symbol){
              showNotification(null, 'Sell',jsonData.stock_symbol)
            }
            if(has_stock_symbol==false){
              showNotification(null, 'Sell',"GDP")
            }  
            pSignal.textContent = 'Sell';
            divHeader.style.background = '#e91e63';
          }
          if(jsonData.final_signal=="Neutral"){
            pSignal.textContent = 'Neutral';
          }

          if(jsonData.data_type=="order_book"){
            pClosePrice.textContent = 'Order Book';
            var a = document.createTextNode(jsonData.price);
            pPriceOrder.textContent = 'Price Order: ';
            pPriceOrder.appendChild(a);
            var b = document.createTextNode(jsonData.quantity);
            pQuantity.textContent = 'Quantity: ';
            pQuantity.appendChild(b);
          }
          if(jsonData.data_type=="news_sentiment"){
            pClosePrice.textContent = 'News Sentiment';
            var a = document.createTextNode(jsonData.sentiment_score);
            pPriceOrder.textContent = 'Sentiment Score : ';
            pPriceOrder.appendChild(a);
            var b = document.createTextNode(jsonData.sentiment_magnitude);
            pQuantity.textContent = 'Sentiment Magnitude : ';
            pQuantity.appendChild(b);
          }
          if(jsonData.data_type=="market_data"){
            pClosePrice.textContent = 'Market Data';
            var a = document.createTextNode(jsonData.market_cap);
            pPriceOrder.textContent = 'Market Cap : ';
            pPriceOrder.appendChild(a);
            var b = document.createTextNode(jsonData.pe_ratio);
            pQuantity.textContent = 'P/E Ratio : ';
            pQuantity.appendChild(b);
          }
          if(jsonData.data_type=="economic_indicator"){
            pClosePrice.textContent = 'Economic';
            pPriceOrder.textContent = 'Indicator Name : GDP Growth Rate';
            var b = document.createTextNode(jsonData.value);
            pQuantity.textContent = 'Value : ';
            pQuantity.appendChild(b);
          }
          divInner.appendChild(pPriceOrder);
          divInner.appendChild(pQuantity);
          divContents.appendChild(divInner);
          divBody.appendChild(divContents);
          divHeader.appendChild(pNameSymbol);
          divHeader.appendChild(pSignal);
          divHeader.appendChild(pClosePrice);
          divHeader.appendChild(pTime);
          divHeader.appendChild(iElement);
          divItem.appendChild(divHeader);
          divItem.appendChild(divBody);
          
          document.getElementById("news_page").prepend(divItem.cloneNode(true));

          if (jsonData.hasOwnProperty('stock_symbol')){
            var divItemCopy = divItem.cloneNode(true);
            if(jsonData.stock_symbol == "AAPL"){
              document.getElementById("AAPL-Signal").prepend(divItemCopy);
            }
            divItemCopy = divItem.cloneNode(true);
            if(jsonData.stock_symbol == "GOOGL"){
              document.getElementById("GOOGL-Signal").prepend(divItemCopy);
            }
            divItemCopy = divItem.cloneNode(true);
            if(jsonData.stock_symbol == "AMZN"){
              document.getElementById("AMZN-Signal").prepend(divItemCopy);
            }
            divItemCopy = divItem.cloneNode(true);
            if(jsonData.stock_symbol == "MSFT"){
              document.getElementById("MSFT-Signal").prepend(divItemCopy);
            }
            divItemCopy = divItem.cloneNode(true);
            if(jsonData.stock_symbol == "TSLA"){
              document.getElementById("TSLA-Signal").prepend(divItemCopy);
            }
          }
          
          if(jsonData.final_signal=="Buy" || jsonData.final_signal=="Sell"){
            document.getElementById("Signals").appendChild(divItem.cloneNode(true));
            updateBadge()
            shakeBell()
          }
          
    } 
    else {
      opening_price = document.createTextNode(jsonData.opening_price)
      volume = document.createTextNode(jsonData.volume)
      high = document.createTextNode(jsonData.high)
      stock_symbol = document.createTextNode(jsonData.stock_symbol)
      low = document.createTextNode(jsonData.low)
      rsi = document.createTextNode(jsonData.rsi)
      closing_price = document.createTextNode(jsonData.closing_price)
      exponential_moving_average = document.createTextNode(jsonData.exponential_moving_average)
      moving_average = document.createTextNode(jsonData.moving_average)
      rsi_signal = document.createTextNode(jsonData.rsi_signal)
      ma_signal = document.createTextNode(jsonData.ma_signal)
      ema_signal = document.createTextNode(jsonData.ema_signal)
      final_signal = document.createTextNode(jsonData.final_signal)

// Create elements
      var divItem = document.createElement('div');
      var divHeader = document.createElement('div');
      var pNameSymbol = document.createElement('p');
      var pSignal = document.createElement('p');
      var pClosePrice = document.createElement('p');
      var pTime = document.createElement('p');
      var iElement = document.createElement('i');
      var divBody = document.createElement('div');
      var divContents = document.createElement('div');
      var divInner1 = document.createElement('div');
      var divInner2 = document.createElement('div');
      var divInner3 = document.createElement('div');
      var divInner4 = document.createElement('div');
      var divInner5 = document.createElement('div');
      var pMA = document.createElement('p');
      var pMASignal = document.createElement('p');
      var pEMA = document.createElement('p');
      var pEMASignal = document.createElement('p');
      var pRSI = document.createElement('p');
      var pRSISignal = document.createElement('p');
      var pOpen = document.createElement('p');
      var pVolume = document.createElement('p');
      var pHight = document.createElement('p');
      var pLow = document.createElement('p');

      // Set classes
      divItem.className = 'accordion-item';
      divHeader.className = 'accordion-header';
      divBody.className = 'accordion-body';

      // Set styles
      divBody.style.display = 'none';
      iElement.className = 'fa fa-chevron-down';
      iElement.ariaHidden = "true"

      // Set text content
      pTime.textContent = time;
      pNameSymbol.appendChild(stock_symbol) ;
      pSignal.appendChild(final_signal) ;
      pClosePrice.appendChild(closing_price) ;



      pMA.textContent = 'Moving Average : ';
      pMA.appendChild(moving_average);
      pMASignal.textContent = 'MA Signal : ';
      pMASignal.appendChild(ma_signal);
      pEMA.textContent = "Exponential Moving Average : ";
      pEMA.appendChild(exponential_moving_average);
      pEMASignal.textContent = "EMA Signal : ";
      pEMASignal.appendChild(ema_signal);
      pRSI.textContent = "RSI : ";
      pRSI.appendChild(rsi);
      pRSISignal.textContent = "RSI Signal : ";
      pRSISignal.appendChild(rsi_signal);
      pOpen.textContent ="Open Price : " ;
      pOpen.appendChild(opening_price);
      pVolume.textContent = "Volume : ";
      pVolume.appendChild(volume);
      pHight.textContent ="Hight Price : ";
      pHight.appendChild(high);
      pLow.textContent = "Low Price : ";
      pLow.appendChild(low);

      if(jsonData.final_signal=="Buy"){
          showNotification(null, 'Buy',jsonData.stock_symbol)
          divHeader.style.background = '#1fb74c';
        }
      if(jsonData.final_signal=="Sell"){
          showNotification(null, 'Sell',jsonData.stock_symbol) 
          divHeader.style.background = '#e91e63';
      }

      // Append elements
      divInner1.appendChild(pMA);
      divInner1.appendChild(pMASignal);
      divBody.appendChild(divInner1);
      divInner2.appendChild(pEMA);
      divInner2.appendChild(pEMASignal);
      divBody.appendChild(divInner2);
      divInner3.appendChild(pRSI);
      divInner3.appendChild(pRSISignal);
      divBody.appendChild(divInner3);
      divInner4.appendChild(pOpen);
      divInner4.appendChild(pVolume);
      divBody.appendChild(divInner4);
      divInner5.appendChild(pHight);
      divInner5.appendChild(pLow);
      divBody.appendChild(divInner5);
      divHeader.appendChild(pNameSymbol);
      divHeader.appendChild(pSignal);
      divHeader.appendChild(pClosePrice);
      divHeader.appendChild(pTime);
      divHeader.appendChild(iElement);
      divItem.appendChild(divHeader);
      divItem.appendChild(divBody);

      var divItemCopy = divItem.cloneNode(true);
      if(jsonData.stock_symbol == "AAPL"){
        document.getElementById("AAPL-Signal").prepend(divItemCopy);
        addData(AAPL_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
        var AAPLsmallChart = createSmallChart('AAPLsmallChart', AAPLpriceData, AAPLtimeData);
      }
      divItemCopy = divItem.cloneNode(true);
      if(jsonData.stock_symbol == "GOOGL"){
        document.getElementById("GOOGL-Signal").prepend(divItemCopy);
        addData(GOOGL_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
        createSmallChart('GOOGLsmallChart', GOOGLpriceData, GOOGLtimeData);
      }
      divItemCopy = divItem.cloneNode(true);
      if(jsonData.stock_symbol == "AMZN"){
        document.getElementById("AMZN-Signal").prepend(divItemCopy);
        addData(AMZN_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
        createSmallChart('AMZNsmallChart', AMZNpriceData, AMZNtimeData);
      }
      divItemCopy = divItem.cloneNode(true);
      if(jsonData.stock_symbol == "MSFT"){
        document.getElementById("MSFT-Signal").prepend(divItemCopy);
        addData(MSFT_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
        createSmallChart('MSFTsmallChart', MSFTpriceData, MSFTtimeData);
      }
      divItemCopy = divItem.cloneNode(true);
      if(jsonData.stock_symbol == "TSLA"){
        document.getElementById("TSLA-Signal").prepend(divItemCopy);
        addData(TSLA_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
        createSmallChart('TSLAsmallChart', TSLApriceData, TSLApriceData);
      }
    
      if(jsonData.final_signal=="Buy" || jsonData.final_signal=="Sell"){
        document.getElementById("Signals").appendChild(divItem.cloneNode(true));
        updateBadge()
        shakeBell()
      }
      scrollToChartEnd();
     }
};











