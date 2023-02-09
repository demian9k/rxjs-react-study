import styles from './carousel3.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faHeartPulse } from '@fortawesome/free-solid-svg-icons'
import {
    ComponentProps,
    FormEvent,
    MutableRefObject, PropsWithChildren, ReactComponentElement,
    ReactDOM,
    ReactElement, ReactNode,
    ReactPropTypes, RefObject,
    useEffect,
    useRef,
    useState
} from "react";
import {fromEvent, merge, of, defer, animationFrameScheduler, interval, concat, Observable} from 'rxjs';
import {
    map,
    startWith,
    switchMap,
    takeUntil,
    reduce,
    share,
    first,
    scan,
    withLatestFrom,
    takeWhile, tap
} from 'rxjs/operators'

import styled from '@emotion/styled'
import { ajax } from 'rxjs/ajax';

interface ContainerULProp {
    translateX: number
    innerRef?:RefObject<HTMLUListElement>
}

const ContainerUL = (props:PropsWithChildren<ContainerULProp>) => {
    return (
        <ul ref={props.innerRef} className={styles.container} style={{transform: `translate3d(${props.translateX}px, 0, 0)`}}>
            {props.children}
        </ul>
    )
}

interface ContainerPanelLIProp extends Partial<CSSStyleDeclaration> {

}
const ContainerPanelLI = (props:PropsWithChildren<ContainerPanelLIProp>) => {
    return (
        <li className={styles.panel} style={{backgroundColor: props.backgroundColor}}>
        </li>
    )
}

export default function Carousel3() {
    /*
        carousel position x state
     */
    const [translateX, setTranslateX] = useState<number>(0)

    const $viewElRef = useRef() as MutableRefObject<HTMLDivElement>;
    const $containerElRef = useRef() as MutableRefObject<HTMLUListElement>;

    useEffect(() => {
        if( $viewElRef.current && $containerElRef.current ) {
            console.log("carousel $viewElRef.current", $viewElRef.current, $containerElRef.current)
            const THRESHOLD = 30;
            const DEFAULT_DURATION = 300;
            // const $view = document.getElementById("carousel");
            const $view = $viewElRef.current

            // const $container = $view.querySelector(".container");
            // const PANEL_COUNT = $container.querySelectorAll(".panel").length;
            const PANEL_COUNT = $containerElRef.current.querySelectorAll("li").length;

            const SUPPORT_TOUCH = "ontouchstart" in window;
            const EVENTS = {
                start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
                move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
                end: SUPPORT_TOUCH ? "touchend" : "mouseup"
            };

            console.log("EVENTS, PANEL_COUNT", EVENTS , PANEL_COUNT)
            function animation(from:number, to:number, duration:number) {
                //defer는 rxjs observable factory를 인수로 받아 observable을 생성하는 오퍼레이터로
                //구독될 때 데이터를 전달하는 게 아니라 observable을 생성한다.
                return defer(() => {
                    const scheduler = animationFrameScheduler;

                    //defer로 생성을 지연시키지 않으면 의도하지 않을 값으로 설정된다.
                    const start = scheduler.now(); //시작시간


                    /*
                        첫번째 map
                        interval 마다 시작시간과 현재시간의 차이를 통해 전체 animation duration에서의 ratio를 구한다

                        두번째 takeWhile 오퍼레이터는 특정 조건이 만족되지 않을 경우 Observable을 완료시키며
                        이 로직에서는 비율이 1 이상이 되면 complete 시키기 위해 사용했다.
                     */

                    const interval$ = interval(0, scheduler)
                        .pipe(
                            map(() => (scheduler.now() - start) / duration),
                            takeWhile(rate => rate < 1)
                        );

                    /*
                        위의 interval 처리에서 takeWhile 조건이 1이하로 발생되므로
                        1값 자체를 포함시키기 위해 concat operator로 interval$ 중간에 전달해준다.

                        그리고 ratio 값으로 to ~ from 사이의 실제 거리를 map 처리한다.
                     */
                    return concat(interval$, of(1))
                        .pipe(
                            map(rate => from + (to - from) * rate)
                        );
                });
            }

            type TouchMouseEvent = TouchEvent & MouseEvent


            function toPos1(v:TouchMouseEvent):number {
                return SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX
            }

            /*
                toPos1 아래처럼 바꾸면
                observable을 인수로 받고 반환하는 함수는 pipe에 합성될 수 있다.
             */
            function toPos(obs$:Observable<TouchMouseEvent>):Observable<number> {
                return obs$.pipe(
                    map(v => SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)
                );
            }

            // function translateX(posX) {
            //     $container.style.transform = `translate3d(${posX}px, 0, 0)`;
            // }

            /*
                mousedown, mousemove 에서 pageX 값 스트림
                mouseup 이벤트 스트림
             */
            const start$ = fromEvent<TouchMouseEvent>($view, EVENTS.start).pipe(
                // map(event => pos1),
                toPos,
                tap( v => console.log(`TouchMouseEvent start$ ${v}`))
            );

            const move$ = fromEvent<TouchMouseEvent>($view, EVENTS.move).pipe(
                toPos,
                tap( v => console.log(`TouchMouseEvent move$ ${v}`))
            );

            const end$ = fromEvent<TouchMouseEvent>($view, EVENTS.end)
            /*
                window.clientWidth stream
             */
            const size$ = fromEvent(window, "resize").pipe(
                //size$ 에서 첫번째 값을 강제로 지정한다.
                //resize 이벤트가 최초엔 없으므로 0을 전달하는 것
                startWith(0),
                map(event => $view.clientWidth),
                tap(v => console.log(`window.resize, clientWidth ${v}`))
            )

            /*
                mouseup 에서 end$ 까지 값 stream
             */
            const drag$ = start$.pipe(
                switchMap(start => {
                    return move$.pipe(
                        //start$, move$의 observable에서 얻은 각각의 위치 정보를 이용해 그 차이를 map으로 변환하여 drag 데이터로 변환한다.
                        map(move => move - start),

                        /*
                           takeUntil() operator 는 첫번째 인자로 전달된 observable 에서 데이터가 발생하는 순간 observable 을 complete 처리하고 구독을 해제한다.
                            move$ observable 을 end$가 발생할 때 중지시키기 위해 사용한다.
                         */
                        takeUntil(end$)
                    );
                }),
                share(), //drop$과  carousel$에 공유하기 위해 hot observable로 변경한다.
                map(distance => ({ distance }))
            )

            const drop$ = drag$.pipe(
                switchMap(drag => {
                    return end$.pipe(
                        map(event => drag),
                        // drag에서 받은 값 중 첫번째 값만 가져온다/
                        first()
                    )
                }),
                /*
                    패널의 넓이는 size$에 전달되므로 drag$의 데이터 흐름에서는 바로 알수 없다.
                    이런 상황일 때  최신의 panel 넓이 를 알아내기 위해서
                    이 데이터 흐름과 상관 없이 다른 stream의 데이터 값을 withLatestFrom 오퍼레이터로 확인할 수 있다,

                    꼬리인수 전까지는 확인하고 싶은 stream들을 가변인자로 받으며
                    꼬리인수로 함수를 받아 전달한 observable의 데이터들을 결합하여 전달한다.
                 */
                withLatestFrom(size$, (drag, size) => {
                    return { ...drag, size };
                })
            );

            /*
                carousel$ 은 merge로 drag$, drop$ 을 병합한 형태의 스트림이다.

                drag 시점에는 number type의 distance값이 전달되고
                drop 시점에는 panel 크기값과 array 타입의 데이터가 전달된다.

             */
            const carousel$ = merge(drag$, drop$)
                .pipe(
                    /*
                        scan은 merge된 2가지 스트림을 일관된 형태로 처리하기 위해 변환하는 오퍼레이터이다.
                        js array의 reduce와 역할이 비슷하지만 결과와 쓰임새는 다르다.
                        rxjs 또한 reduce operator를 있다, 이 오퍼레이터는 observable이 complete 되었을 때 한번 데이터가 전달되어 accumulate 된 값을 만들기 위해 사용한다.

                        반면에 scan은 누적된 값이 한번 발생하는 것이 아니라 데이터가 발생할 때마다 다른 데이터를 발생시킨다.
                        그러므로 데이터가 발생될 때마다 기존 상태를 유지하거나 관리하기 위한 용도로 사용된다.
                     */
                    scan<{distance:number, size?:number}, any>((store, {distance, size}) => {
                        const updateStore:Record<string,any> = {
                            from: -(store.index * store.size) + distance,
                        };

                        if (size === undefined) { // drag 시점
                            updateStore.to = updateStore.from;
                        } else {  // drop 시점
                            let tobeIndex = store.index;

                            /*
                                거리가 임계치보다 클 경우 현재 index에서 다음 index로 이동한다.

                                거리가 임계치보다 크지 않을 경우 index를 tobeIndex로 사용하고

                                0보다 작거나 현재 패널의 개수보다 작을 경우 다시 현재의 index값을 지정하도록 max, min을 사용하여 구한다.
                             */
                            if (Math.abs(distance) >= THRESHOLD) {
                                tobeIndex = distance < 0 ?
                                    Math.min(tobeIndex + 1, PANEL_COUNT - 1) :
                                    Math.max(tobeIndex - 1, 0);
                            }
                            updateStore.index = tobeIndex;
                            updateStore.to = -(tobeIndex * size);
                            updateStore.size = size;
                        }
                        console.log("carousel$ scan -- updateStore ", updateStore)
                        return { ...store, ...updateStore };
                    }, {
                        from: 0,
                        to: 0,
                        index: 0,
                        size: 0,
                    }),
                    /*
                        먼저 scan에의해 변환된

                        from , to가 같으면 drag에 의해 이동하므로 of로 처리하고
                        다른 경우 drop에 의해 animation이 동작해야 한다
                     */
                    switchMap(({from, to}) => from === to ?
                        of(to) : animation(from, to, DEFAULT_DURATION))
                );

            carousel$.subscribe(pos => {
                console.log("캐로셀 데이터", pos);
                setTranslateX(pos);
            });
        }

    }, [])

    return (
        <>
            <div id="carousel" className={styles.view} ref={$viewElRef}>
                <ContainerUL translateX={translateX} innerRef={$containerElRef}>
                    <ContainerPanelLI backgroundColor="lightgreen" />
                    <ContainerPanelLI backgroundColor="lightpink" />
                    <ContainerPanelLI backgroundColor="royalblue" />
                    <ContainerPanelLI backgroundColor="darkred" />
                </ContainerUL>
            </div>
        </>
    )
}