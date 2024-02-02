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
              pQuantity.textContent = 'Magnitude : ';
              pQuantity.appendChild(b);
            }
            if(jsonData.data_type=="market_data"){
              pClosePrice.textContent = 'Market Data';
              var a = document.createTextNode(jsonData.market_cap);
              var a1 = document.createTextNode(" B");;
              pPriceOrder.textContent = `Market Cap : `;
              pPriceOrder.appendChild(a);
              pPriceOrder.appendChild(a1);
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
                updateChart('AAPL', jsonData.final_signal);
              }
              divItemCopy = divItem.cloneNode(true);
              if(jsonData.stock_symbol == "GOOGL"){
                document.getElementById("GOOGL-Signal").prepend(divItemCopy);
                updateChart('GOOGL', jsonData.final_signal);
              }
              divItemCopy = divItem.cloneNode(true);
              if(jsonData.stock_symbol == "AMZN"){
                document.getElementById("AMZN-Signal").prepend(divItemCopy);
                updateChart('AMZN', jsonData.final_signal);
              }
              divItemCopy = divItem.cloneNode(true);
              if(jsonData.stock_symbol == "MSFT"){
                document.getElementById("MSFT-Signal").prepend(divItemCopy);
                updateChart('MSFT', jsonData.final_signal);
              }
              divItemCopy = divItem.cloneNode(true);
              if(jsonData.stock_symbol == "TSLA"){
                document.getElementById("TSLA-Signal").prepend(divItemCopy);
                updateChart('TSLA', jsonData.final_signal);
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
          createSmallChart('AAPLsmallChart', AAPLpriceData, AAPLtimeData);
          updateChart('AAPL', jsonData.final_signal);
          updateTable('AAPL', jsonData.final_signal, jsonData.closing_price, jsonData.volume,time);
        }
        divItemCopy = divItem.cloneNode(true);
        if(jsonData.stock_symbol == "GOOGL"){
          document.getElementById("GOOGL-Signal").prepend(divItemCopy);
          addData(GOOGL_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
          createSmallChart('GOOGLsmallChart', GOOGLpriceData, GOOGLtimeData);
          updateChart('GOOGL', jsonData.final_signal);
          updateTable('GOOGL', jsonData.final_signal, jsonData.closing_price, jsonData.volume,time);
        }
        divItemCopy = divItem.cloneNode(true);
        if(jsonData.stock_symbol == "AMZN"){
          document.getElementById("AMZN-Signal").prepend(divItemCopy);
          addData(AMZN_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
          createSmallChart('AMZNsmallChart', AMZNpriceData, AMZNtimeData);
          updateChart('AMZN', jsonData.final_signal);
          updateTable('AMZN', jsonData.final_signal, jsonData.closing_price, jsonData.volume,time);
        }
        divItemCopy = divItem.cloneNode(true);
        if(jsonData.stock_symbol == "MSFT"){
          document.getElementById("MSFT-Signal").prepend(divItemCopy);
          addData(MSFT_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
          createSmallChart('MSFTsmallChart', MSFTpriceData, MSFTtimeData);
          updateChart('MSFT', jsonData.final_signal);
          updateTable('MSFT', jsonData.final_signal, jsonData.closing_price, jsonData.volume,time);
        }
        divItemCopy = divItem.cloneNode(true);
        if(jsonData.stock_symbol == "TSLA"){
          document.getElementById("TSLA-Signal").prepend(divItemCopy);
          addData(TSLA_chart, time, jsonData.closing_price,jsonData.moving_average,jsonData.exponential_moving_average,jsonData.rsi, jsonData.volume);
          createSmallChart('TSLAsmallChart', TSLApriceData, TSLApriceData);
          updateChart('TSLA', jsonData.final_signal);
          updateTable('TSLA', jsonData.final_signal, jsonData.closing_price, jsonData.volume,time);
        }
      
        if(jsonData.final_signal=="Buy" || jsonData.final_signal=="Sell"){
          document.getElementById("Signals").appendChild(divItem.cloneNode(true));
          updateBadge()
          shakeBell()
        }
        scrollToChartEnd();
       }
    };