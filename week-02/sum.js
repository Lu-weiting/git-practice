// ary: number array
function sum(ary) {
	// TODO: sum all elements in ary
    let sum = 0;
    ary.forEach(item => {
        sum += item;
    });
    return sum;
}

//挑戰題1：目前只想到xd..->

function sum2(ary) {
    return ary.reduce((acc, cur) => acc + cur, 0);
}

//挑戰題2
function sumGeneral(n){
    return n * (n + 1) / 2;
}
//遞迴嘗試：
let total =0;
function sumGeneral2(n){
    if(n === 0){
        return;
    }
    total += n;
    sumGeneral2(n-1);
    return total;
}


console.log(sum([1, 5, 3, 2])); // 11
console.log(sum2([1, 5, 3, 2]));
console.log(sumGeneral(10));
console.log(sumGeneral2(2));