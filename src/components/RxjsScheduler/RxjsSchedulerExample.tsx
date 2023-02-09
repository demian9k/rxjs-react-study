import React, {PropsWithChildren, useEffect, useState} from "react";
import {Link, LinkProps, Outlet, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import NestedLink from "./NestedLink";
import DefaultSchedulerExample from "./DefaultSchedulerExample";
import SubjectExample from "./SubjectLogger";
import AsyncSchedulerExample from "./AsyncSchedulerExample";


const RxjsSchedulerExample = (props:PropsWithChildren) => {
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
            setLogs((state) => [...state, args])
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
        console.log("RxjsScheduler name", name)
        initialize()

        switch(name) {
            case "default":
                setExample(new DefaultSchedulerExample(logger)); break;
            case "async":
                setExample(new AsyncSchedulerExample(logger)); break;
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
const RxjsSchedulerExamples = (props: PropsWithChildren) => {
    return (
        <ComponentRoot>
            <LinkContainer>
                    <LinkItem>
                        <NestedLink to="/rxjs-scheduler/default">default</NestedLink>
                    </LinkItem>
                    <LinkItem>
                        <NestedLink to="/rxjs-scheduler/async">async</NestedLink>
                    </LinkItem>
                    {/*<LinkItem>*/}
                    {/*    <NestedLink to="/rxjs-scheduler/asap">asap</NestedLink>*/}
                    {/*</LinkItem>*/}
                    {/*<LinkItem>*/}
                    {/*    <NestedLink to="/rxjs-scheduler/animationFrame">animationFrame</NestedLink>*/}
                    {/*</LinkItem>*/}
                    {/*<LinkItem>*/}
                    {/*    <NestedLink to="/rxjs-scheduler/queue">queue</NestedLink>*/}
                    {/*</LinkItem>*/}
            </LinkContainer>
            <OutletContainer>
                <Outlet />
            </OutletContainer>
            </ComponentRoot>
    )
}

export {
    RxjsSchedulerExamples,
    RxjsSchedulerExample
}
