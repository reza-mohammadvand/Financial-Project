
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
  var accordion = (function(){
  
    var $accordion = $('.js-accordion');
    var $accordion_header = $accordion.find('.js-accordion-header');
    var $accordion_item = $('.js-accordion-item');
   
    // default settings 
    var settings = {
      // animation speed
      speed: 400,
      
      // close all other accordion items if true
      oneOpen: false
    };
      
    return {
      // pass configurable object literal
      init: function($settings) {
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
              
        if(settings.oneOpen && $this[0] != $this.closest('.js-accordion').find('> .js-accordion-item.active > .js-accordion-header')[0]) {
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
  })();
  
  $(document).ready(function(){
    accordion.init({ speed: 300, oneOpen: true });
  });



  // bell
var count_notif = 0; // Initialize notification count

function shakeBell() {
    $("#bell-icon").css({
        "animation": "rotation 0.2s linear",
        "animation-iteration-count": "5" // Run the animation 3 times
    }); // Apply the rotation animation
    count_notif++; // Increment the notification count
    $("#notification-count").text(count_notif); // Update the notification count display
    setTimeout(function(){ 
        $("#bell-icon").css({
            "animation": "",
            "animation-iteration-count": ""
        }); 
    }, 1500); // Remove the animation after 1.5s (0.5s * 3)
}



var count = 0; // Initialize alert box count

function showAlertBox() {
    count++; // Increment the alert box count
    var alertBox = document.createElement('div');
    alertBox.id = 'alertBox' + count;
    alertBox.className = 'alert-box';
    alertBox.style.background = "#e91e63";
    alertBox.innerHTML = '<p style=color:#fff; opacity:1;>You Have a Sell Signal for AAPL </p>';
    document.body.appendChild(alertBox);
    setTimeout(function() {
        alertBox.className += ' show';
    }, 100);
    setTimeout(function() {
        hideAlertBox(count);
    }, 3000); // Hide the alert box after 3 seconds
}

function hideAlertBox(count) {
    var alertBox = document.getElementById('alertBox' + count);
    alertBox.className = 'alert-box';
    setTimeout(function() {
        document.body.removeChild(alertBox);
    }, 2000);
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



var volumeData = [5070, 5072, 5069, 5073, 5075,7500, 5072, 5069, 5073, 7055, 5075, 5075, 5075, 5072, 5069, 5073, 5075,7500, 5072, 5069, 5073, 7055, 5075, 5075,]; // This will be populated with your volume data
var total = volumeData.reduce((a, b) => a + b, 0);
var average = total / volumeData.length;


var numDataPoints = 15; // The number of data points
var pointWidth = 80; // The width of each data point in px
document.getElementById('myChart').width = numDataPoints * pointWidth;



const myChart = new Chart("myChart", {
  type: "bar",
  data: {
    labels: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05","2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-05","2024-01-05", "2024-01-05", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05","2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-05","2024-01-05", "2024-01-05"], // This will be populated with your time data
    datasets: [{
      label: 'price',
      data: [120.1, 121.5, 119.7, 122.3, 123.5,120.1, 121.5, 119.7, 122.3, 123.5, 123.5, 75, 75, 121.5, 119.7, 122.3, 123.5,120.1, 121.5, 119.7, 122.3, 123.5, 123.5, 75, 75], // This will be populated with your price data
      borderColor: 'rgba(75,192,192,1)',
      type: 'line'
    }, {
      label: 'MA',
      data: [120.1, 120.8, 120.43, 120.9, 121.42,120.1, 120.8, 120.43, 120.9, 121.42, 123.5, 75, 75, 120.8, 120.43, 120.9, 121.42,120.1, 120.8, 120.43, 120.9, 121.42, 123.5, 75, 75], // This will be populated with your moving average data
      borderColor: 'rgba(192,75,192,1)',
      type: 'line'
    }, {
      label: 'EMA',
      data: [120.1, 120.93, 120.48, 121.27, 122.07,120.1, 120.93, 120.48, 121.27, 122.07, 123.5, 75, 75, 120.8, 120.43, 120.9, 121.42,120.1, 120.8, 120.43, 120.9, 121.42, 123.5, 75, 75], // This will be populated with your EMA data
      borderColor: 'rgba(192,192,75,1)',
      type: 'line'
    }, {
      label: 'RSI',
      data: [70, 72, 69, 73, 75,70, 72, 69, 73, 75, 75, 75, 75, 72, 69, 73, 75,70, 72, 69, 73, 75, 75, 75, 75], // This will be populated with your RSI data
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
        position: 'right',
        id: 'y-axis-1',
      }, 
      {
        id: 'y-axis-volume',
        type: 'linear',
        display: false,
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
        // afterBody: function(tooltipItems, data) {
        //   var tooltipItem = tooltipItems[0];
        //   var afterBody = [];
        //   var dataPoint = data.datasets[0].data[tooltipItem.index]; // Always refer to the first dataset
        //   afterBody.push('Open: ' + dataPoint.open);
        //   afterBody.push('High: ' + dataPoint.high);
        //   afterBody.push('Low: ' + dataPoint.low);
        //   afterBody.push('Volume: ' + dataPoint.volume);
        //   return afterBody;
        // }
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

// Generate a custom legend
var ul = document.getElementById("chart-legend");
myChart.data.datasets.forEach((dataset, i) => {
  var li = document.createElement("li");
  li.style.color = dataset.borderColor;
  li.textContent = dataset.label;
  li.onclick = function(e) {
    var hidden = !myChart.getDatasetMeta(i).hidden;
    myChart.getDatasetMeta(i).hidden = hidden;
    li.style.textDecoration = hidden ? "line-through" : "";
    myChart.update();
  };
  ul.appendChild(li);
});




// Add Item
function addData(chart, label, priceData, maData, emaData, rsiData, volumeData) {
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(priceData);
  chart.data.datasets[1].data.push(maData);
  chart.data.datasets[2].data.push(emaData);
  chart.data.datasets[3].data.push(rsiData);
  chart.data.datasets[4].data.push(volumeData);
  chart.update();
}



addData(myChart, "2024-01-06", 1024.7, 1201.92, 1022.57, 76, 5000);




// go to end of chart
window.onload = function() {
  var element = document.getElementById("chartWrapper");
  element.scrollLeft = element.scrollWidth;
}





