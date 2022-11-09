var createStack = function () {
  return {
    items: [],
    push(item) {
      this.items.push(item);           
      return item;
    },
    pop() {
      return this.items.pop();
    }
  }
}

const stack = createStack();
console.log(stack.push(100)); //! 100
console.log(stack.push(5)); //! 5
console.log(stack.push(1000)); //! 1000
console.log(stack.pop()); //!1000
console.log(stack.items);  //[100 , 5 ,1000]