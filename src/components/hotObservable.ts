import {range, filter, map, Observable, interval, publish, connectable, Subject, Subscription} from 'rxjs'

/*
    hot observable은 공유에 사용되는 observable로 일반적인 observable(cold) 에 반하는 종류이다.
 */

/*
    hotObservable 생성방법1
    subject를 obs 외부에 생성하고
    하위 스트림을(partition 등으로 파생된) 생성, 구독
    root stream이 subject를 구독
 */
const createHotObservable01 = () => {
    const subject = new Subject();

// observerA를 등록
    subject.subscribe({
        next: (v) => console.log(`observerA: ${v}`)
    });
// 데이터 1을 전달
    subject.next(1);

// observerB를 등록
    subject.subscribe({
        next: (v) => console.log(`observerB: ${v}`)
    });
// 데이터 2를 전달
    subject.next(2);
}


/*
       Subject() 생성 외에 hot observable

       connectable observable 사용 예제
       connectSub, sub1, sub2 순으로 subscribe() 되며
       순차적으로 unsubs 되는데
 */
const usingConnectableObservable = () => {
    const number$ = interval(1000);

    /*
        publish() -> deprecated -> connectable()
        multicast() -> deprecated -> connectable()
        refCount() -> deprecated -> share()
     */
    /*
      create hot observable 2
   */
    // const connectable$ = number$.pipe(multicast(new Subject()))

    /*
       create hot observable 3
       publish() = multicast(new Subject()) 의 alias
    */
    // const connectable$ = number$.pipe(publish())

    /*
        create hot observable 4
        share() = publish() + refCount()
     */
    // const connectable$ = number$.pipe(share())

    /*
        refCount() operator는 subscriber ref 갯수를 자동관리 하여
        connectableObservable 구독 시작시 connect()를 자동으로 하고
        모든 subs가 unsub 될 때 connectableObservable를 unsubscribe() 한다,
     */
    const connectable$ = connectable(number$, {connector: () => new Subject(), resetOnDisconnect: false})

    let connectSub: Subscription, sub1: Subscription, sub2: Subscription;

    sub1 = connectable$.subscribe(v => console.log(`observerA: ${v}`));
    connectSub = connectable$.connect();

    setTimeout(() => {
        sub2 = connectable$.subscribe(v => console.log(`observerB: ${v}`));
    }, 1100);

    setTimeout(() => {
        console.log(`observerA is unsubscribed`);
        sub1.unsubscribe();
    }, 2100)

    setTimeout(() => {
        console.log(`observerB is unsubscribed`);
        sub2.unsubscribe();
        console.log(`connectableObservable is unsubscribed`);
        connectSub.unsubscribe(); // number$의 데이터 전송을 중지 한다.
    }, 3100)
}



export {
    createHotObservable01,

    usingConnectableObservable
}
