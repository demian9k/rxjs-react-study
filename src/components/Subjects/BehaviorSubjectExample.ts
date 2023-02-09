import {
    BehaviorSubject
} from 'rxjs'
import {SimpleLogger} from "./types";
import SubjectLogger from "./SubjectLogger";

export default class BehaviorSubjectExample extends SubjectLogger {

    constructor(public logger:SimpleLogger) {
        super(logger);
    }


    /*
        BehaviorSubject
        생성자에서 arg로 initial value 를 받는다.

        BehaviorSubject 는 데이터를 전달하기 전에 구독 되어 있다면 initial value를 구독자에게 전달하며
        데이터 전달 이후부터는 구독 시점과 상관없이 마지막 상태를 전달한다.
        BehaviorSubject는 getValue() 메서드로 마지막으로 발행된 값을 얻을 수 있다.
     */
    run() {
        console.log("behavior subject run")
        const logger = this.logger

        //initial value를 받아 인스턴스가 만들어진다
        const subject = new BehaviorSubject<string | number>("start");

        //구독자A가 데이터 발행 전 subscribe()
        subject.subscribe({
            next: (v) => logger.log(`observerA: ${v}`),
            complete: () => logger.log("observerA completed")
        });

        /*
            next() 메서드로 값 2개 발행
         */
        subject.next(1);
        subject.next(2);

        /*
        데이터 전달 이후부터는 구독 시점과 상관없이 마지막 상태를 전달
         */

        //구독자B subscribe()
        subject.subscribe({
            next: (v) => logger.log(`observerB: ${v}`),
            complete: () => logger.log("observerB completed")
        });

        subject.complete();

        const timeoutId =
            setTimeout(() => {
            subject.subscribe({
                next: (v) => logger.log(`observerC: ${v}`),
                complete: () => logger.log("observerC completed")
            });
        }, 2000);

        console.log("behavior subject run 2")

        this.timeoutIDs.push(timeoutId)
        this.subject = subject
    }
}
