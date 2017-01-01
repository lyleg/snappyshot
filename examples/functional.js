/* @flow */

type Name = {
  first:string,
  last:string
}

type Address = {
  name:Name,
  street:string,
  zipcode: number
}
/*
export function add(num1: number, num2: number): number {
  return num1 + num2;
}


export function total(numbers: Array<number>) {
  var result = 0;
  for (var i = 0; i < numbers.length; i++) {
    result += numbers[i];
  }
  return result;
}
*/
export function processCustomFlowType(address:Address, foo:string){
  return address
}
