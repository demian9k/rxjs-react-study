import {SimpleLogger} from "./types";
import {AsyncSubject, SubjectLike} from "rxjs";

export default abstract class SubjectExample {

    timeoutIDs:number[] = []
    subject?:SubjectLike<any>

    protected constructor(public logger:SimpleLogger) {

    }
    abstract run():void

    clear() {
        this.timeoutIDs.forEach( id => {
            clearTimeout(id)
        })

        if( this.subject )
            this.subject?.complete()
    }
}

