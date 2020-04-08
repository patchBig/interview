# Interview at Microsoft - Javascript Assessment Questions

## Questions

Write a function solution that, given a string S of N lowercase English letters, returns a string with no instances of three identical consecutive letters, obtained from S by deleting the minimum possible number of letters.

Examples:

1. Given S = 'eedaaad', the function should return 'eedaad'. One occurrence of letter a is deleted.
2. Given S = 'xxxtxxx', the function should return 'xxtxx'. Note that letter x can occur more than three times in the returned string. If the occurrences are not consecutive.
3. Given S = 'uuuuxaaaaxuuu', the function should return 'uuxaaxuu'.

White an efficient algorithm for the following assumptions:

- N is an integer within the range [1...200,000]
- string S consists only of lowercase letters(a-z)

Solutions:

```javascript
// solution1:
// You need to use back-references. For example if you capture something with () you can refer back to that same match with \1. If you capture two things, then the first is \1 and the 2nd is \2 and so on. Here's an example of what I mean
function solution(s) {
  return s.replace(/(\w)\1{2,}/g, function(match, letter) {
    return letter + letter
  })
}

//solution2:
function cleanString(S) {
  for(var i = 0; i < S.length; i++) {
    let re = new RegExp(`${S[i]}{3,}`, g)
    if(re.test(re)) {
      S = S.replace(re, S[i] + S[i])
    }
  }
  return S
}
```

----

Write a function solution that, given an array A consisting of N integers, return the maximum sum of two numbers whose digits add up to an equal sum. If there are no two numbers whose digits have an equal sum, the function should return -1.

Examples:

1. Given A = [51, 71, 17, 42], the function should return 93. There are two pairs of numbers whose digits add up to an equal sum: (51, 42) and (17, 71). The first pair sums up to 93.
2. Given A = [42, 33, 60]. the function should return 102. The digits of all the numbers in A add up to the same sum, and choosing to add 42 and 60 gives the result 102.
3. Given A = [51, 32, 43], the function should return -1, since all numbers in A have digits that add up to different, unique sums.

Write an efficient algorithm for the following assumptions:

- N is an integer within the range [1...200,000]
- each element of array A is an integer within the range [1...1,000,000,000]

```javascript
function digitSum(n) {
  let sum = 0;
  while(n) {
    sum += n % 10;
    n = parseInt(n / 10)
  }
  return sum
}

function findSum(arr) {
  let ans = -1;
  let mp = {}
  arr.forEach(item => {
    let sum = digitSum(item);
    if (mp[sum]) {
      ans = Math.max(ans, (item + mp[sum]))
      mp[sum] = Math.max(mp[sum], item)
    }
    else {
      mp[sum] = item
    }
  })
  return ans
}
```
