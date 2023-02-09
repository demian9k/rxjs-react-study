import {
    AsyncSubject,
} from 'rxjs'
import {SimpleLogger} from "./types";
import SubjectLogger from "./SubjectLogger";

export default class AsyncSubjectExample extends SubjectLogger {

    constructor(public logger:SimpleLogger) {
        super(logger);
    }
    run() {
        const logger = this.logger
        const subject = new AsyncSubject();

        subject.subscribe({
            next: (v) => logger.log(`observerA: ${v}`),
            complete: () => logger.log("observerA completed")
        });

        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.next(4);

        subject.subscribe({
            next: (v) => logger.log(`observerB: ${v}`),
            complete: () => logger.log("observerB completed")
        });

        subject.complete();

        const timeoutId = setTimeout(() => {
            subject.subscribe({
                next: (v) => logger.log(`observerC: ${v}`),
                complete: () => logger.log("observerC completed")
            });
        }, 2000)

        this.timeoutIDs.push(timeoutId)
        this.subject = subject
    }
}
