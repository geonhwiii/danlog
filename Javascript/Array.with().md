> MDN : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/with


## 1. Array.with(index, value)

`Array` 인스턴스의 **`with()`** 메서드는 주어진 인덱스의 값을 변경하기 위해 [대괄호 표기법](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Property_accessors#bracket_notation)을 사용하는 것의 [복사](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods) 버전입니다. 이 함수는 지정된 인덱스의 요소가 지정된 값으로 대체된 새 배열을 반환합니다.

   
```ts
// 하나의 요소만 변경한 채로 새로운 배열 만들기
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6)); // [1, 2, 6, 4, 5]
console.log(arr); // [1, 2, 3, 4, 5]
```


```ts
// 배열 메서드 연속하여 연결하기
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6).map((x) => x ** 2)); // [1, 4, 36, 16, 25]
```


```ts
// 희소 배열에서 with() 사용하기
const arr = [1, , 3, 4, , 6];
console.log(arr.with(0, 2)); // [2, undefined, 3, 4, undefined, 6]
```


```ts
// 배열이 아닌 객체에서 with() 사용하기
const arrayLike = {
  length: 3,
  unrelated: "foo",
  0: 5,
  2: 4,
};
console.log(Array.prototype.with.call(arrayLike, 0, 1));
// [ 1, undefined, 4 ]
```
