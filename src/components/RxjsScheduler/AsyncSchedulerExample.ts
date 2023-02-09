import {
    asyncScheduler,
    BehaviorSubject, observeOn, of, subscribeOn
} from 'rxjs'
import {SimpleLogger} from "./types";
import SubjectLogger from "./SubjectLogger";
import {tap} from "rxjs/operators";

export default class AsyncSchedulerExample extends SubjectLogger {

    constructor(public logger:SimpleLogger) {
        super(logger);
    }


    /*
        asyncScheduler
        subscribeOn() 메서드로 스케줄러를 지정할 수 있다.
     */
    run() {
        console.log("async scheduler example run")
        const logger = this.logger

        const obs$ = of("A", "B", "C")
            .pipe(
                tap(v => logger.log(`${v} 데이터처리1`)),
                tap(v => logger.log(`${v} 데이터처리2`)),
                tap(v => logger.log(`${v} 데이터처리3`)),
                tap(v => logger.log(`${v} 데이터처리4`)),
                subscribeOn(asyncScheduler), //데이터 발행 시점 스케줄러
                observeOn(asyncScheduler), //데이터 수신 시점 스케줄러
            )

        logger.log("BEFORE subscribe()")

        const timeoutId = setTimeout(() => {
            const start = new Date().getTime()

            logger.log("[1초 후 subscribe]")

            //등록시 callback이 데이터를 받는 시점은 각 observeOn에 지정된 스케줄러에 따라 달라진다.
            obs$.subscribe(v => logger.log("observer received ", v))

            //asyncScheduler 이므로 이 라인은 subsribe 등록 이후 바로 처리 된다.
            //defaultScheduler는 모든 데이터가 처리된 이후 동작한다.
            logger.log(`subscribe 후 ${new Date().getTime() - start} ms`)

        }, 1000)

        this.timeoutIDs.push(timeoutId)
        // this.subject = obs$
    }
}
