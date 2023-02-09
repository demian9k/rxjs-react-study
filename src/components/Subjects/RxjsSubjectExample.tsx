import React, {PropsWithChildren, useEffect, useState} from "react";
import {Link, LinkProps, Outlet, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import NestedLink from "./NestedLink";
import BehaviorSubjectExample from "./BehaviorSubjectExample";
import ReplaySubjectExample from "./ReplaySubjectExample";
import AsyncSubjectExample from "./AsyncSubjectExample";
import SubjectExample from "./SubjectLogger";

/*
  일반적인 subject는 hot observable로서 구독 전 데이터를 구독자가 받을 수 없지만
  behavior, replay, async 3가지 특별한 유형의 subject들은 구독 전의 데이터를 받을 수 있다.
*/

const RxjsSubjectExample = (props:PropsWithChildren) => {
    const { name } = useParams();

    const [logs, setLogs] = useState<string[]>([])
    const [example, setExample] = useState<SubjectExample>()

    // logger.log = (...args:any) => {
    //
    // }

    let logger = {
        log(...args:any) {
            console.log("logs", logs)
            console.log("args", args)
            setLogs((state) => [...state, ...args])
        },
    };

    function initialize() {
        console.log("cleared", logs)
        if(example) {
            console.log("example exist", example)
            example.clear()
        }
        if( logs )
            setLogs([])
    }

    useEffect(() => {
        console.log("RxjsSubjectExample name", name)

        initialize()


        switch(name) {
            case "behavior":
                setExample(new BehaviorSubjectExample(logger)); break;
            case "replay":
                setExample(new ReplaySubjectExample(logger)); break;
            case "async":
                setExample(new AsyncSubjectExample(logger)); break;
            default:
                example?.clear(); initialize(); break;
        }
    }, [name])


    useEffect(() => {
        if( typeof example! != "undefined" ) {
            logger.log(`${name} started`)
            example.run()
        }
    }, [example])

    return (
        <div>
            <div><button onClick={initialize}>initialize</button></div>
            LOGS:
            {
                logs.map((d,i) => {
                    return <div key={i}>{d}</div>
                })
            }
        </div>
    )
}

const ComponentRoot = styled.div`
    
`

const LinkContainer = styled.div`
  overflow: hidden;
  background-color: #333333;
`

const LinkItem = styled.span`
  margin:1em;
  overflow: hidden;
  background-color: #333333;
  font-size:1.3em;
  color: navajowhite;
`

const OutletContainer = styled.div`
    
`

const RxjsSubjectExamples = (props: PropsWithChildren) => {
    return (
        <ComponentRoot>
            <LinkContainer>
                    <LinkItem>
                        <NestedLink to="/rxjs-subject/behavior">behavior</NestedLink>
                    </LinkItem>
                    <LinkItem>
                        <NestedLink to="/rxjs-subject/replay">replay</NestedLink>
                    </LinkItem>
                    <LinkItem>
                        <NestedLink to="/rxjs-subject/async">async</NestedLink>
                    </LinkItem>
            </LinkContainer>
            <OutletContainer>
                <Outlet />
            </OutletContainer>
            </ComponentRoot>
    )
}

export {
    RxjsSubjectExamples,
    RxjsSubjectExample
}
