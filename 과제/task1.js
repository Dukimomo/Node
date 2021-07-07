//1부터 10000까지 숫자 중에 3이 몇번 나오는지 갯수를 출력하세요.
//es6구문 객체함수 만들때 참조
/*
Array.from()객체메서드
.filter
.join()
.split('')
*/
let cnt = 0;
var strNum;
for(let i=1; i<=10000; i++){
    strNum = String(i);
    for(let j=0; j<strNum.length; j++){
        //1, 2, 3, 4, .. 33,....55, 333
        if(strNum[j] === "3"){
            cnt++;
        }
    }
}
console.log(cnt);

let cntNum = Array.from({length:10000}, (v, k)=> k+1)
            .join()
            .split('')
            .filter(n=>n === "3")
            .length;
console.log(cntNum);

let cntNum1 = Array.from({length:10000}, (v, k)=> k+1)
            .join()
            .split('3')
            .length-1; 



