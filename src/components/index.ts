


const mergeTypeOperator = `
   mergeAll 
       Converts a higher-order Observable into a first-order Observable which concurrently delivers all values that are emitted on the inner Observables.
       
   merge
       여러개의 Observable을 합쳐서 하나의 Observable로 만든다. 
       Flattens multiple Observables together by blending their values into one Observable.
       
   mergeMap
      mergeAll() === mergeMap(obs$ => obs$)
      mergeAll()은 mergeMap을 상속하여 identity 가 적용된 간편 오퍼레이터이다.
      
      
   switchAll
      mergeAll 과 유사하게 Observable안에 있는 여러개의 Observable을 꺼내 하나의 Observable로 만든다.
      다른 점은 switchAll은 내부 Observable을 unsubs 하고 새로운 observable을 sub 해서 flatten 한다.
      중요 기능은 내부 observable을 unsub하는 것이고 switchAll을 사용하는 observable을 unsubs는 것은 아니다.
      
   switchMap
       map + switchAll 이다.
       
   catchError
       observable에서 error가 발생했을 때 error handler 함수가 실행되는데 이것을 실행하지 않고 error를 그대로 던지기 위해 사용하는 operator 이다.
        
   retry
     오류가 발생하면 관찰 가능한 시퀀스를 특정 횟수만큼 재시도한다. (오류 발생시 바로 error로 간주하지 않고 재시도하며, 재시도도 실패할 경우에 error로 처리한다.)
        
`

export {
    mergeTypeOperator
}