// the first element of te process.argv array is always 'node', and the second element is always the path to your baby-steps.js file
// so you need to start at the 3rd element (index 2)
// if (process.argv.length > 2) {
//     let arr = process.argv.slice(2);
//     let sum = 0;
//     for(var i = 0; i < arr.length; i++) {
//         sum += Number(arr[i])
//     }
//     console.log(sum)
// }

'use strict'
    
let result = 0

for (let i = 2; i < process.argv.length; i++) {
    result += Number(process.argv[i])
}

console.log(result)