var createIncrement = function(){
    let count = 0;
    function increment(){
        count++;
        console.log(count)
    }
    let message = `Count is ${count}`;
    function log(){
        console.log(message);
    }

    return [increment,log];
}

const [increment,log] = createIncrement();
increment();
increment();
increment();
log(); // Console.log Result is "Count is 0" 