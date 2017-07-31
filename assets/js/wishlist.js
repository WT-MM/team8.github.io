/* for the wishlist */
var itemsObject = Object;
  var items = []; 
  var currentSelection = "1,1000000";

  $(document).ready(function(){
    
    //Retrieving items...
    $.getJSON( "https://spreadsheets.google.com/feeds/list/1dJP9wr7XmPxGEo28wU5zNUAvR-EnljaTrrKOKmpOe_I/od6/public/values?alt=json", function(data) {
      itemsObject = data.feed.entry; 
      sortItems();
    });
  });
  function sortItems(){

    //Adding the table headers
    document.getElementById("toshow").innerHTML = "<th class=\"col-md-5\">Item Name</th><th class=\"col-md-3\">Online Vendor</th><th class=\"col-md-1\">Quantity</th><th class=\"col-md-3\">Total Price</th>";

    //Converting itemsObject into an array and storing it in items.
    items = $.map(itemsObject, function(value, index) {
        return [value];
    });

    items = items.sort(function(a, b){
      var firstPriceString = a["gsx$price"]["$t"];
      firstPriceString = firstPriceString.substr(1);
      firstPriceString = firstPriceString.replace(/,/g , "");
      var firstPrice = parseFloat(firstPriceString);
      
      var secondPriceString = b["gsx$price"]["$t"];
      secondPriceString = secondPriceString.substr(1);
      secondPriceString= secondPriceString.replace(/,/g , "");
      var secondPrice = parseFloat(secondPriceString);

      return firstPrice-secondPrice;
    })

    createTable()
  }
  function createTable(){
    var innerHTML = "";
        for (var i = 0; i < items.length; i++){
          innerHTML += "\n<tr>";
            innerHTML += "\n<td>" + items[i]["gsx$tool"]["$t"] + "</td>";
            innerHTML += "\n<td><a target=\"_blank\" href=\"" + items[i]["gsx$website"]["$t"] + "\">" + items[i]["gsx$vendorname"]["$t"] + "</a></td>";
            innerHTML += "\n<td>" + items[i]["gsx$qty"]["$t"] + "</td>";
            innerHTML += "\n<td>" + items[i]["gsx$price"]["$t"] + "</td>\n</tr>";
        }

        document.getElementById("csv-import").innerHTML = innerHTML;
        document.getElementById("loader").style.display = "none";
  }
  function paginationClicked(priceRange){

        //Finds the pagination that was clicked earlier and deletes the "active" class from it
        document.getElementById(currentSelection).className = document.getElementById(currentSelection).className.replace( /(?:^|\s)active(?!\S)/g , '' )

        var minPrice = priceRange[0];
        var maxPrice = priceRange[1];

        //Sets currentSelection to the button currently selected and updates the pagination
        currentSelection = minPrice.toString() + "," + maxPrice.toString();
        document.getElementById(currentSelection).className += "active";

        //The table is ordered price wise, from lowest to higest. minIndex finds the lowest index of the price range in the table.
        var minIndex = 0;

        //i for while loop
        var i = 0;

        //If minPrice is already 0, we don't want to waste time looping through.
        if (minPrice != 0){
          
          while (minIndex == 0){
        //Converting the currentPrice
        var currentPriceString = items[i]["gsx$price"]["$t"];
        currentPriceString = currentPriceString.substr(1);
        currentPriceString = currentPriceString.replace(/,/g , "");
        var currentPrice = parseFloat(currentPriceString);

              if (minPrice < currentPrice){
                  minIndex = i;
              }

                i++
            }

        }else{
          minIndex = 0;
        }

        //The table is ordered price wise, from lowest to higest. maxIndex finds the lowest index of the price range in the table.
        var maxIndex = 0;

        //i for while loop
        i = 0;

        //If minPrice is already 0, we don't want to waste time looping through.
        if (maxPrice != 1000000.0){
            console.log(maxIndex);
          while (maxIndex == 0){

        //Converting the currentPrice
              var currentPriceString = items[i]["gsx$price"]["$t"];
        currentPriceString = currentPriceString.substr(1);
        currentPriceString = currentPriceString.replace(/,/g , "");
        var currentPrice = parseFloat(currentPriceString);

              if (maxPrice < currentPrice){
                  maxIndex = i;
              }

                i++
            }

        }else{
          maxIndex = items.length;
        }
        console.log("minIndex",minIndex);
        console.log("maxIndex",maxIndex);
        var innerHTML = "";
        for (var i = minIndex; i < maxIndex; i++){
          innerHTML += "\n<tr>";
            innerHTML += "\n<td>" + items[i]["gsx$tool"]["$t"] + "</td>";
            innerHTML += "\n<td><a target=\"_blank\" href=\"" + items[i]["gsx$website"]["$t"] + "\">" + items[i]["gsx$vendorname"]["$t"] + "</a></td>";
            innerHTML += "\n<td>" + items[i]["gsx$qty"]["$t"] + "</td>";
            innerHTML += "\n<td>" + items[i]["gsx$price"]["$t"] + "</td>\n</tr>";
        }
        document.getElementById("csv-import").innerHTML = innerHTML;

  }