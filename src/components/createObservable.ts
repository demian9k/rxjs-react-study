import {range, filter, map, Observable,
    of, fromEvent, from, interval,

    EMPTY, mergeMap, throwError, NEVER
} from 'rxjs'


/*
    Observable 생성자를 이용하여 Observable 만들기
 */
const createObservable01 = () => {

    const numbers$ = new Observable(function subscribe(observer) {
        observer.next(1);
        observer.next(2);
        observer.next(3);
    });
    numbers$.subscribe(v => console.log(v));

    // 1
    // 2
    // 3


}

/*
    에러 발생
 */
const createObservable02 = () => {
    const numbers$ = new Observable(function subscribe(observer) {
        try {
            observer.next(1);
            observer.next(2);
            // 에러가 발생한다면?
            throw new Error("데이터 전달 도중 에러가 발생했습니다");
            observer.next(3);
        } catch (e) {
            observer.error(e);
        }
    });
    numbers$.subscribe({
        next: v => console.log(v),
        error: e => console.error(e)
    });

    // 1
    // 2
    // "데이터 전달 도중 에러가 발생했습니다"
}


/*
    데이터 전달이 완료된 경우
 */
const createObservable03 = () => {
    const numbers$ = new Observable(function subscribe(observer) {
        try {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        } catch (e) {
            observer.error(e);
        }
    });

    numbers$.subscribe({
        next: v => console.log(v),
        error: e => console.error(e),
        complete: () => console.log("데이터 전달 완료")
    });

    // 1
    // 2
    // 3
    // "데이터 전달완료"

}

/*
    구독 해제
 */
const createObservable04 = () => {
    const interval$ = new Observable(function subscribe(observer) {
        const id = setInterval(function () {
            observer.next(new Date().toString());
        }, 1000);
        return function () { // 자원을 해제하는 함수
            console.log("interval 제거");
            clearInterval(id);
        };
    });
    const subscription = interval$.subscribe(v => console.log(v));

    // 5초 후 구독을 해제한다.
    setTimeout(function () {
        subscription.unsubscribe();
    }, 5000);

    // "Sun Oct 01 2017 01:34:33 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:34 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:35 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:36 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:37 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:38 GMT+0900 (KST)"
    // "Sun Oct 01 2017 01:34:39 GMT+0900 (KST)"
    // "interval 제거"
}

/*
    of
 */
const createObservable05 = () => {
    of(10, 20, 30)
        .subscribe({
            next: console.log,
            error: console.error,
            complete: () => console.log("완료")
        });

    // 10
    // 20
    // 30
    // 완료

}

/*
   range
 */
const createObservable06 = () => {

    range(1, 10)
        .subscribe({
            next: console.log,
            error: console.error,
            complete: () => console.log("완료")
        });

    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
    // 7
    // 8
    // 9
    // 10
    // 완료
}

/*
    fromEvent
 */
const createObservable07 = () => {

    const click$ = fromEvent(document, "click");

    const subscription = click$.subscribe({
        next: v => console.log("click 이벤트 발생"),
        error: e => console.error(e),
        complete: () => console.log("완료")
    });

    // click 이벤트 발생
    // click 이벤트 발생
    // click 이벤트 발생
    // ...

}

/*
    from
 */
const createObservable08 = () => {

    from([10, 20, 30])
        .subscribe({
            next: v => console.log(v),
            error: e => console.log(e),
            complete: () => console.log("완료")
        });
    // 10
    // 20
    // 30
    // 완료

    const arguments$ = (function(...args) {
        return from(args);
    })(1, 2, 3)
        .subscribe({
            next: v => console.log(v),
            error: e => console.log(e),
            complete: () => console.log("완료")
        });
    // 1
    // 2
    // 3
    // 완료

    const map$ = from(new Map([[1, 2], [2, 4], [4, 8]]));
    map$.subscribe({
        next: v => console.log(v),
        error: e => console.log(e),
        complete: () => console.log("완료")
    });

    // [1, 2]
    // [2, 4]
    // [4, 8]
    // 완료

    const success$ = from(Promise.resolve(100));
    success$.subscribe({
        next: v => console.log(v),
        error: e => console.log(e),
        complete: () => console.log("완료")
    });
    // 100
    // 완료

    const fail$ = from(Promise.reject("에러"));
    fail$.subscribe({
        next: v => console.log(v),
        error: e => console.log(e),
        complete: () => console.log("완료")
    });
    // 에러

}

/*
    interval
 */
const createObservable09 = () => {
    interval(1000)
        .subscribe({
            next: v => console.log(v),
            error: e => console.log(e),
            complete: () => console.log("완료")
        });

    // 0
    // 1
    // 2
    // ...
}

/*
    empty
 */
const createObservable10 = () => {
    of(1, -2, 3).pipe(
        map(number => number < 0 ? EMPTY : number)
    )
    .subscribe({
        next: v => console.log(v),
        error: e => console.log(e),
        complete: () => console.log("완료")
    });

    // 1
// empty Observable
// 3
}

/*
    throwError
 */
const createObservable11 = () => {
    of(1, -2, 3).pipe(
        mergeMap(number => number < 0 ? throwError("number는 0보다 커야한다") : of(number))
    )
    .subscribe({
        next: v => console.log(v),
        error: e => console.error(e),
        complete: () => console.log("완료")
    });

    // 1
    // number는 0보다 커야한다

}

/*
    NEVER
 */
const createObservable12 = () => {
    of(1, -2, 3).pipe(
        map(number => number < 0 ? NEVER : number)
    )
        .subscribe({
            next: v => console.log(v),
            error: e => console.log(e),
            complete: () => console.log("완료")
        });

    // 1
    // never Observable
    // 3
}

export {
    createObservable01,
    createObservable02,
    createObservable03,
    createObservable04,
    createObservable05,
    createObservable06,
    createObservable07,
    createObservable08,
    createObservable09,
    createObservable10,
    createObservable11,
    createObservable12,
}
