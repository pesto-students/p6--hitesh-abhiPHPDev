let userDetails={
    name:'Abhishek',
    age: 33,
    profession: "Software Engineer",
};
let userDetails2={
    name:'Jhone Doe',
    age: 40,
    profession: "Testing Engineer",
};

let printDetails = function(type){
    console.log(type+": "+this.name+" is a "+this.profession);
}

let uD1 = printDetails.bind(userDetails,'User 1');
let uD2 = printDetails.bind(userDetails2,'User 2');
console.log('=> This is a bind function example');
uD1();//! Print User 1 Details
uD2();//! Print User 2 Details
console.log(' End of bind function example');


let userDetails3 = {
    name:'Meenakshi',
    age: 33,
    profession: "Teacher",
}
let userDetails4 = {
    name:'ABC',
    age: 33,
    profession: "Professor",
}
console.log('=> This is a Call function example');

printDetails.call(userDetails3,"User 3"); // Print User 3 Details
printDetails.call(userDetails4,"User 4");  // Print User 4 Details
console.log(' End of Call function example');

console.log('=> This is a Apply function example');

printDetails.apply(userDetails2,['User 2 for Apply Function'])

console.log(' End of Apply function example');