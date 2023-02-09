import {range, filter, map, Observable, interval, publish, connectable, Subject, Subscription, of} from 'rxjs'
import {reduce, scan} from "rxjs/operators";

const usingObservable = () => {
    range(1, 200)
        .pipe(
            filter((x: number) => x % 2 === 1),
            map((x: number) => x + x)
        )
        .subscribe((x: number) => console.log(x));
}

/*
    interval observable  promise 재사용
 */
const usingObservable_IntervalPromise = () => {

// 정의
    const numbers$ = interval(1000);

// 사용: subscribe가 호출되는 순간부터 데이터가 전달된다.
    numbers$.subscribe(value => console.log(`첫번째 ${value}`));

    setTimeout(() => {
        // 또 사용
        numbers$.subscribe(value => console.log(`두번째 ${value}`));
    }, 2000);

}


/*
    Promise-lazy
 */
const usingObservable_PromiseLazy = () => {
    const promise = new Promise((resolve, reject) => {
        console.log("create promise");
        try {
            resolve(1);
        } catch (e) {
            reject("error promise");
        }
    });

// then은 결정된 상태값만을 반환한다.
    promise.then(
        value => console.log(`첫번째 promise ${value}`),
        error => console.error(`첫번째 promise ${error}`)
    ); // 1 출력
    promise.then(
        value => console.log(`두번째 promise ${value}`),
        error => console.error(`두번째 promise ${error}`)
    ); // 1 출력

}

const usingObservable_ObservableLazy = () => {

    /*
        Observable.create는 deprecated이며
        v8 에서 삭제될 예정
     */
    // const numbers$ = Observable.create(observer => {
    const numbers$ = new Observable(observer => {
        console.log("create observable");
        try {
            observer.next(1);
        } catch (e) {
            observer.error("error observable");
        } finally {
            observer.complete();
        }
    });

    /*
        observable.subscribe() deprecated

        // const sumObserver = {
        //   sum: 0,
        //   next(value) {
        //     console.log('Adding: ' + value);
        //     this.sum = this.sum + value;
        //   },
        //   error() {
        //     // We actually could just remove this method,
        //     // since we do not really care about errors right now.
        //   },
        //   complete() {
        //     console.log('Sum equals: ' + this.sum);
        //   }
        // };
     */

    numbers$.subscribe(
        // value => console.log(`첫번째 observable ${value}`),
        // error => console.log(`첫번째 observable ${error}`)
        {
            next(value) {
                console.log(`첫번째 observable ${value}`)
            },
            error(error) {
                console.log(`첫번째 observable ${error}`)
            },
            complete() {

            }
        }
    );

    numbers$.subscribe(
        // value => console.log(`첫번째 observable ${value}`),
        // error => console.log(`첫번째 observable ${error}`)
        {
            next(value) {
                console.log(`두번째 observable ${value}`)
            },
            error(error) {
                console.log(`두번째 observable ${error}`)
            }
        }
    );
}

/*
    promise 에서의 cancel 방법
 */
const usingObservable_PromiseCancel = () => {
    const promise = new Promise((resolve, reject) => {
        try {
            let value = 0;
            setInterval(() => {
                console.log(`is going ${value}`);
                resolve(value++);
            }, 1000);
        } catch (e) {
            reject("error promise");
        }
    });

    promise.then(
        value => console.log(`promise value ${value}`)
    );
}

/*
    observable에서의 cancle 방법
 */
const usingObservable_ObservableCancel = () => {
    const obs$ = new Observable(observer => {
        let id: number

        try {
            let value = 0;
            id = setInterval(() => {
                console.log(`is going ${value}`);
                observer.next(value++);
            }, 1000);
        } catch (e) {
            observer.error(e);
        }
        // unsubscribe될 때 호출되는 함수를 반환 teardown
        return () => {
            clearInterval(id);
            console.log("cancelled");
        }
    })

    const subscription = obs$.subscribe(
        value => console.log(`observable value ${value}`)
    );

// 3초 후에 observable의 구독을 취소
    setTimeout(() => subscription.unsubscribe(), 3000);
}

/*
    pipe and scan
 */
const usingReduceOperator = () => {

    //reduce는 of에서 선언된 값을을 하나의 결과로 aggregate 한다.
    of(10, 10, 20, 0, 50)
        .pipe(
            reduce((acc, value, index) => {
                acc.sum += value;
                acc.average = acc.sum / (index + 1);
                return acc;
            }, {
                sum: 0,
                average: 0
            })
        ).subscribe(value => console.log("reduce", value))

    //reduce { sum: 90, average: 18 }
}

const usingScanOperator = () => {

    //scan은 of에서 선언된 값을을 각각 하나의 결과로 출력한다.
    of(10, 10, 20, 0, 50)
        .pipe(
            scan((acc, value, index) => {
                acc.sum += value;
                acc.average = acc.sum / (index + 1);
                return acc;
            }, {
                sum: 0,
                average: 0
            })
        ).subscribe(value => console.log("scan", value))

    // scan {sum: 10, average: 10} // 10
    // scan {sum: 20, average: 10} // 10, 10
    // scan {sum: 40, average: 13.333333333333334} // 10, 10, 20
    // scan {sum: 40, average: 10} // 10, 10, 20, 0
    // scan {sum: 90, average: 18} // 10, 10, 20, 0, 50
}


export {
    usingObservable,
    usingObservable_IntervalPromise,
    usingObservable_PromiseLazy,
    usingObservable_ObservableLazy,
    usingObservable_PromiseCancel,
    usingObservable_ObservableCancel,
    usingReduceOperator,
    usingScanOperator
}
