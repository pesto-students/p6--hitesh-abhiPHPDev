var jsonArray = []; // Create JSON Array to store the input numbers with result
/**
* @memoize function is a function when user input the numbers and click on button It immediate Execute and Produce appropriate Result
*/

var memoize = function(){ 
    var input1 = document.getElementById('number1').value; //input 1 value
    var input2 = document.getElementById('number2').value; //input 2 value

    if(!input1)
        input1 = 0;
    if(!input2)
        input2 = 0;

    var input1 = parseInt(input1);    
    var input2 = parseInt(input2);    
    var result = 0;

    var existedResult = filterjsonArr(jsonArray,input1,input2);
    if(existedResult>=0){ //Check result is already exist
        var result = 'Result is already available:'+existedResult;
    }else{
        var result = addParams(input1,input2); // new result is generated
        var arr = {
            i1:input1,
            i2:input2,
            data:result 
        };
        jsonArray.push(arr);
        // console.log(jsonArray); // Print JsonArray in Log
        result = 'New Result is generated:'+result
    }
    displayLogs(result); // Show Logs in div .log-messages
}

/**
 * 
 * @param {*} arr JSON Array 
 * @param {*} value1  input 1 value
 * @param {*} value2  input 2 value
 * @returns as result variable 
 */
var filterjsonArr=function(arr,value1,value2){
    // console.log('Check data=>'+value1+"  "+value2)
    let result=-1 ;
    arr.forEach(element => { 
        if(element.i1===value1 && element.i2===value2){
            result =  element.data;
        }
    });
    return result; // return result if already in Array otherwise return -1
}

/** 
*
* @param {*} i1 For user input 1 
* @param {*} i2 for user input 2
* @returns addition of i1 and i2
*/
var addParams=function(i1,i2){
    return i1+i2; //add parameters
}

/**
 *  Display Log @.log-messages Div 
 *  @params {*} log to print the result in respective div
 */

var displayLogs = function(log){
    var logDiv = document.querySelector('.log-messages');
    var p = document.createElement('p');
    p.innerHTML = log ;
    logDiv.insertBefore(p,logDiv.firstElementChild); 
}