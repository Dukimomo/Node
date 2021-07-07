function makeCounter(predicate) {
    let num = 0;

    return function () {
        num = predicate(num);
        return num;
    }
}
function increase(n) {
    return ++n;
}
function decrease(n) {
    return --n;
}

const increaser = makeCounter(increase);
console.log(increaser());
console.log(increaser());
