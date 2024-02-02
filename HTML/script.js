
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



// bell notif

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



// trade box
function showBox(sel) {
var boxes = document.getElementById("trade").querySelectorAll('.symbol-trade');
boxes.forEach(function(box) {
  box.style.display = 'none';
});

var selectedBox = document.getElementById(sel.value);
if (selectedBox) {
  selectedBox.style.display = 'flex';
}
}

function changeBackground(radio, color) {
var boxes = document.querySelectorAll('div');
boxes.forEach(function(box) {
  box.style.backgroundColor = '';
});

if (radio.checked) {
  var box = document.getElementById('box' + radio.id.charAt(radio.id.length-1));
  box.style.backgroundColor = color;
}
}



// cyrcle chart

let charts = {};

function initCharts(symbols) {
  symbols.forEach(symbol => {
      let ctx = document.getElementById(symbol).getContext('2d');
      charts[symbol] = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ['Buy', 'Sell', 'Neutral'],
              datasets: [{
                  data: [0, 0, 0],
                  backgroundColor: ['Green', 'Red', 'Grey'],
                  hoverBackgroundColor: ['LightGreen', 'LightCoral', 'LightGrey'],
                  hoverBorderColor: 'rgba(234, 236, 244, 1)',
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,  // Add this line
              title: {
                  display: true,
                  text: `Final Signals for ${symbol}`,
                  fontSize: 14
              },
              legend: {
                  labels: {
                      fontSize: 14
                  }
              },
              tooltips: {
                  titleFontSize: 14,
                  bodyFontSize: 14,
                  backgroundColor: "rgb(255,255,255)",
                  bodyFontColor: "#858796",
                  borderColor: '#dddfeb',
                  borderWidth: 1,
                  xPadding: 15,
                  yPadding: 15,
                  displayColors: false,
                  caretPadding: 10,
              },
          }
      });
  });
}


function updateChart(stock_symbol, final_signal) {
  let chart = charts[stock_symbol];
  if (final_signal === 'Buy') {
      chart.data.datasets[0].data[0]++;
  } else if (final_signal === 'Sell') {
      chart.data.datasets[0].data[1]++;
  } else if (final_signal === 'Neutral') {
      chart.data.datasets[0].data[2]++;
  }
  chart.update();
}

// Initialize the charts
initCharts(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']);



// table
let lastPrices = {};

function updateTable(stock_symbol, final_signal, final_price, volume,time) {
// Calculate the percentage change
let percentage_change = 0;
if (lastPrices[stock_symbol]) {
    percentage_change = ((final_price - lastPrices[stock_symbol]) / lastPrices[stock_symbol]) * 100;
}
lastPrices[stock_symbol] = final_price;

// Update the table
let table = document.getElementById(stock_symbol + '-table').getElementsByTagName('tbody')[0];
let newRow = table.insertRow(0);
newRow.innerHTML = `
    <td>${final_price}</td>
    <td>${final_signal}</td>
    <td>${volume}</td>
    <td style="color: ${percentage_change >= 0 ? 'green' : 'red'}">${percentage_change.toFixed(2)}%</td>
    <td>${time}</td>
`;
}