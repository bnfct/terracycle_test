//here we generate the rows and columns for the items
function generateItemsHTML() {
    var generated_html = "";
    for (var i = 0; i < 5; i++) {
        generated_html += "<div class=\"row\">";
        for (var ii = 0; ii < 5; ii++) {
            generated_html += "<div class=\"item-column\"></div>";
        }
        generated_html += "</div>";
    }

    document.getElementById("vending_machine_items").innerHTML = generated_html;
}

//after we generate the numbers we see for the items
function generateItemsNumberHTML() {
    var generated_html = "";
    var row_number = 0;
    var column_number = 0;
    for (var i = 0; i < 5; i++) {
        generated_html += "<div class=\"row\">";
        row_number++;
        column_number = 0;
        for (var ii = 0; ii < 5; ii++) {
            column_number++;
            generated_html += "<div class=\"column\"><span><p>"+row_number+""+column_number+"</p></span></div>";
        }
        generated_html += "</div>";
    }

    document.getElementById("vending_machine_numbers").innerHTML = generated_html;
}

//then after we generate the pinpad
function generatePinpad() {
    var generated_html = "";
    var column_number = 0;
    var other_buttons = "<div class=\"row\"><div class=\"column\"><span><button onclick=\"resetsum()\">C</button></span></div><div class=\"column\"><span><button onclick=\"enternum('0')\">0</button></span></div><div class=\"column\"><span><button class=\"ok-button\" onclick=\"okpush()\">OK</button></span></div></div>";
    for (var i = 0; i < 3; i++) {
        generated_html += "<div class=\"row\">";
        for (var ii = 0; ii < 3; ii++) {
            column_number++;
            generated_html += "<div class=\"column\"><span><button onclick=\"enternum('"+column_number+"')\">"+column_number+"</button></span></div>";
        }
        generated_html += "</div>";
    }
    generated_html += other_buttons;
    document.getElementById("numpad_container").innerHTML = generated_html;
}

//this is a random number generator between 2 numbers
function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//we get the available slots in an array
var itemsPlaces = document.getElementsByClassName("item-column");

//item div's we put in the html
var itemBomba = "<div class=\"buyable-item bomba\"><img src=\"img/product-bomba.png\"><img src=\"img/product-bomba.png\"><img src=\"img/product-bomba.png\"></div>";
var itemSnickers = "<div class=\"buyable-item snickers\"><img src=\"img/product-snickers.png\"><img src=\"img/product-snickers.png\"><img src=\"img/product-snickers.png\"></div>";
var itemMars = "<div class=\"buyable-item mars\"><img src=\"img/product-mars.png\"><img src=\"img/product-mars.png\"><img src=\"img/product-mars.png\"></div>";

//these are the item's prices
var itemBomba_price = 315;
var itemSnickers_price = 220;
var itemMars_price = 190;

//we store the placed items data here
var itemsPlaced = [];

//how much money we entered
var total_sum = 0;

//pincode number
var entered_num = "";

//the exchange money
var minus = 0;

//count the coins
var counter_200 = 0;
var counter_100 = 0;
var counter_50 = 0;
var counter_20 = 0;
var counter_10 = 0;
var counter_5 = 0;

//This function is randomly fills up the vending machine on the page load
function itemLoad() {
    generateItemsHTML();
    generateItemsNumberHTML();
    generatePinpad();
    //we loop trough the items places then we put a random item in each place
    for (var i = 0; i < itemsPlaces.length; i++) {
        var randomnumber = randomIntFromInterval(1, 3);
        if (randomnumber == 1) {
            //first we put the html to display the item
            itemsPlaces[i].innerHTML = itemBomba;
            //then we put the item's data in a separate array
            itemsPlaced.push(["bomba", 3, itemBomba_price]);
        } else if (randomnumber == 2) {
            itemsPlaces[i].innerHTML = itemSnickers;
            itemsPlaced.push(["snickers", 3, itemSnickers_price]);
        } else if (randomnumber == 3) {
            itemsPlaces[i].innerHTML = itemMars;
            itemsPlaced.push(["mars", 3, itemMars_price]);
        }
    }
}
//this is load the item filler function on the page load
window.onload = itemLoad;

//This function will outputs you the item's number in the array by checking the entered pin number
function getItemNumber(num) {
    //first we put in an array the 2 numbers, because the first number is the row number, the second is the column
    var number = Array.from(num);
    var return_number;
    if (number[0] == 1) {
        //if the first number is 1 it means the item will take place in the first row
        return_number = 0;
    } else if (number[0] == 2) {
        //if the first number is 2, it means the item must take place in the second row
        return_number = 5;
    } else if (number[0] == 3) {
        //yadayada
        return_number = 10;
    } else if (number[0] == 4) {
        return_number = 15;
    } else if (number[0] == 5) {
        return_number = 20;
    }

    //After we got the correct row number, we sum the column number to it, so we get the item's number in the array
    //where we can check the item's data
    return_number += parseInt(number[1])-1;

    return return_number;
}

//this function returns the item's data in an array by giving it the array's number
function getItemData(num) {
    return itemsPlaced[getItemNumber(num)];
}

//this function removes one (1) item from the HTML and from the item array when it's called
function removeItem(num) {
    if (itemsPlaced[num][1] != 0) {
        itemsPlaces[num].getElementsByTagName("div")[0].getElementsByTagName("img")[itemsPlaced[num][1]-1].style.display = "none";
        itemsPlaced[num][1] -= 1;
    }
}

//this function called when one of the coins is pushed
//then the pushed coin's value is added to the total entered sum
function addsum(sum) {
    total_sum += sum;
    document.getElementById("vending-machine-counter").innerHTML=total_sum;
}

//if we want to reset the process we call this function
function resetsum() {
    //resets the entered coins
    total_sum = 0;
    //resets the entered pin number
    entered_num = "";
    document.getElementById("vending-machine-counter").innerHTML=total_sum;
}

//this is the pin pad enter function which concats the entered numbers
function enternum(num) {
    entered_num += num;
    if(entered_num.length >= 3) {
        entered_num = "";
        entered_num += num;
    }
    document.getElementById("vending-machine-counter").innerHTML=entered_num;
}

//this is the final function which checks when the OK button pushed
function okpush() {
    //first we check if we entered a 2 digit number on the pinpad
    if (entered_num.length < 2) {
        //if its not 2 digit long display error
        document.getElementById("vending-machine-counter").innerHTML="ERROR";
    } else {
        //if it's a 2 digit number, we get the item data from the entered number
        var selected_item_data = getItemData(entered_num);
        //then we check if we have the selected item in stock, if not, display an error message
        //if we have more than 0 in stock, we will continue in the else
        if (selected_item_data[1] < 1) {
            document.getElementById("vending-machine-counter").innerHTML="NO STOCK";
        } else {
            //we check if the selected item's price is equal or lesser then the entered money
            //if it's less, we count the exchange coins
            //if not, display error message
            if (selected_item_data[2] <= total_sum) {
                //we must wait 3 seconds before we continue, so display a message while we wait
                document.getElementById("vending-machine-counter").innerHTML= "SERV.";
                setTimeout(function() {
                    //we get the exchange amount by remove the item's price from the entered amount
                    minus = total_sum - selected_item_data[2];

                    //and then we check how much coins we need to give back
                    //starting from the biggest
                    if (minus >= 200) {
                        //first we divide the exchange amount with the coin's value
                        //we get a float number
                        var howmany = minus / 200;
                        //we don't need a float number, so we floor it with a bitwise operation
                        var howmany_floor = howmany | 0;
                        //so we a get round number, how much coins we need to give back
                        //then we divide the exchange value with the given coin
                        minus = minus % 200;
                        //and after we count how much we gave back from the coins
                        counter_200 += howmany_floor;
                        //update the given coin counter
                        document.getElementById("counter200").innerHTML=counter_200;
                    }
                    
                    if (minus >= 100) {
                        var howmany = minus / 100;
                        var howmany_floor = howmany | 0;
                        minus = minus % 100;
                        counter_100 += howmany_floor;
                        document.getElementById("counter100").innerHTML=counter_100;
                    }
                    
                    if (minus >= 50) {
                        var howmany = minus / 50;
                        var howmany_floor = howmany | 0;
                        minus = minus % 50;
                        counter_50 += howmany_floor;
                        document.getElementById("counter50").innerHTML=counter_50;
                    }
                    
                    if (minus >= 20) {
                        var howmany = minus / 20;
                        var howmany_floor = howmany | 0;
                        minus = minus % 20;
                        counter_20 += howmany_floor;
                        document.getElementById("counter20").innerHTML=counter_20;
                    }
                    
                    if (minus >= 10) {
                        var howmany = minus / 10;
                        var howmany_floor = howmany | 0;
                        minus = minus % 10;
                        counter_10 += howmany_floor;
                        document.getElementById("counter10").innerHTML=counter_10;
                    }
                    
                    if (minus >= 5) {
                        var howmany = minus / 5;
                        var howmany_floor = howmany | 0;
                        minus = minus % 5;
                        counter_5 += howmany_floor;
                        document.getElementById("counter5").innerHTML=counter_5;
                    }

                    //then we remove the item from the array and from the HTML with this function
                    removeItem(getItemNumber(entered_num));
                    //reset the values
                    total_sum = 0;
                    minus = 0;
                    //update the display
                    document.getElementById("vending-machine-counter").innerHTML=total_sum;
                  }, 3000);
            } else {
                //if we don't entered enough money to the selected item, display the item's price for 1 second
                document.getElementById("vending-machine-counter").innerHTML=getItemData(entered_num)[2]+"!";
                setTimeout(function() {
                    //after 1 second display again the entered money
                    document.getElementById("vending-machine-counter").innerHTML=total_sum;
                  }, 1000);
            }
        }
    }
}
