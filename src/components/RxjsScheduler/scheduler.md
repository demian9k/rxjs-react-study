## rxjs scheduler

rx scheduler는 데이터 흐름을 제어하기 위해 rxjs에서 만든 가상의 스케줄러이다.

rx scheduler는 각 언어별로 존재하며 언어의 특징에 의존하므로 언어별로 쓰임새도 다르다.  
swift의 경우 동시성 처리를 thread로 처리하므로 scheduler는 어떤 스레드로 데이터를 처리할지가 주요 관심사지만  
rxjs scheduler는 single thread에서 동작하므로 내부적으로 동작하는 게 다르다.


| 스케줄러                    | 설명                                                                        | 용도                                                 |
|-------------------------|---------------------------------------------------------------------------|----------------------------------------------------|
| null                    | 동기적으로 데이터를 전달                                                             | 기본 스케줄러로서 observable이 complete되어야 메인 스레드가 멈추지 않는다. |
| queueScheduler          | queue 구조와 비슷하게 동작                                                         | FIFO 순서를 지키며 동기적으로 처리한다 반복작업 처리시 사용된다.             |
| asyncScheduler          | microtask 대기열 등록되는 스케줄러로 setImmediate, process.nextTick() (nodejs)로 동작한다. | 주로 비동기 변환 처리를 할 경우에 사용된다.                          |
| asapScheduler           | setInterval로 동작하는 스케줄러                                                    | 시간과 관련된 오퍼레이터에 사용                                  |
| animationFrameScheduler | requestAnimationFrame으로 동작하는 스케줄러                                         | animation을 제어할 때 사용한다.                             |





### 스케줄러가 제어 시점

1. observable의 데이터 발행 시점
2. observer가 데이터 수신 시점

### 스케줄러 선택 operator

- 데이터 발행시점의 스케줄러는 subscribeOn(scheduler) 메서드를 통해  지정할 수 있고 
- 데이터 수신 시점의 스케줄러는 observeOn(scheduler) 메서드를 통해 지정할 수 있다.

스케줄러 선택 operator는 pipe() 내부의 순서에 따라 동작이 달라진다. 

subscribeOn 메서드는 발행시점을 제어하므로 부분적으로 적용하지 않으므로 순서에 영향을 받지 않고
observeOn 메서드는 pipe() 내 operator 순서에 따라 달라진다.

```javascript

const obs$ = of("A", "B", "C")
    .pipe(
        tap( v => console.log("기본스케줄러 데이터 처리1")),
        tap( v => console.log("기본스케줄러 데이터 처리2")),
        observeOn(asyncScheduler), //이후 작업은 async scheduler로 처리
        tap( v => console.log("asyncScheduler 데이터 처리1")),
        tap( v => console.log("asyncScheduler 데이터 처리2")),
        observeOn(asapScheduler), //이후 작업은 asap scheduler로 처리
        tap( v => console.log("asapScheduler 데이터 처리1")),
        tap( v => console.log("asapScheduler 데이터 처리2")),
    )

```

또한 observable을 생성하는 from, interval, of, throwError 같은 함수들에 인수로 스케줄러를 지정할 수 있다.





