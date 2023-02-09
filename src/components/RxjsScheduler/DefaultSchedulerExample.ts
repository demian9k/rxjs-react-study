import {
    asyncScheduler,
    BehaviorSubject, of, subscribeOn
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
        subscribeOn() 메서드로 스커줄러를 지정할 수 있다.

     */
    run() {
        console.log("default scheduler run")
        const logger = this.logger

        const obs$ = of("A", "B", "C")
            .pipe(
                tap(v => logger.log(`${v} 데이터처리1`)),
                tap(v => logger.log(`${v} 데이터처리2`)),
                tap(v => logger.log(`${v} 데이터처리3`)),
                tap(v => logger.log(`${v} 데이터처리4`)),
            )

        logger.log("BEFORE subscribe()")

        const timeoutId = setTimeout(() => {
            const start = new Date().getTime()

            logger.log("[1초 후 subscribe]")

            obs$.subscribe(v => logger.log("observer received ", v))

            //defaultScheduler는 모든 데이터가 처리된 이후 동작한다.
            logger.log(`subscribe 후 ${new Date().getTime() - start} ms`)

        }, 1000)

        this.timeoutIDs.push(timeoutId)
        // this.subject = obs$
    }
}
