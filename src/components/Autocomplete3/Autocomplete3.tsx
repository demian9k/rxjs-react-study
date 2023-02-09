import styles from './autocomplete.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faHeartPulse } from '@fortawesome/free-solid-svg-icons'
import {FormEvent, MutableRefObject, useEffect, useRef, useState} from "react";
import {fromEvent, Observable, partition} from 'rxjs';
import styled from '@emotion/styled'

import {
    map,
    switchMap,
    debounceTime,
    filter,
    distinctUntilChanged,
    tap,
    retry,
    finalize,
    share
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

interface GitHubUserItem {
    login:string
    avatar_url:string
    html_url:string
}

interface GitHubUserSearchResult {
    incomplete_results: boolean,
    items: GitHubUserItem[],
    total_count:number
}

/*
  autocompleted user list
 */
const UserLI = (props: { user: GitHubUserItem }) => {
    const user = props.user
    return (<li className="user">
        <img src={user.avatar_url} width="50px" height="50px"/>
        <p><a href={user.html_url} target="_blank">${user.login}</a></p>
    </li>)
}

const LoadingDiv = styled.div<{isLoading:boolean}>`
  position: absolute;
  z-index: 2;
  top: 2px;
  right: 0px;
  display: ${ props => (props.isLoading ? 'block' : 'none')};
`

export default function Autocomplete3() {

    const [users, setUsers] = useState<GitHubUserItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function showLoading() {
        setIsLoading(true)
    }
    function hideLoading() {
        setIsLoading(false)
    }

    const searchElRef = useRef() as MutableRefObject<HTMLInputElement>;


    useEffect(() => {
        console.log("searchElRef.current", searchElRef.current)
        if( searchElRef.current ) {
            console.log("searchElRef.current")

            function iteratee(event:Event) {
                console.log("iteratee event", event)
                return (event.target as HTMLInputElement).value
            }

            /*
                publish() 는 multicast(new Subject())
                share() op는  publish() + refCount() 와 같으므로
                keyup$은 hot observable 로 바뀌고, 첫번째 구독부터 데이터가 흐르기 시작하며 마지막 unsub에 keyup$의 도 unsub 된다.
             */
            const keyup$ = fromEvent<KeyboardEvent>(searchElRef.current, "keyup")
                .pipe(
                    debounceTime(300), // 키보드 이벤트를 300ms에 한번만 발행한다.
                    map(iteratee), //htmlInputEvent에서 event.target.value로 변환한다.

                    // distinctUntilChanged는 동일한 데이터가 전달되는 경우 이전과 다른 데이터를 전달되기 전까지 전달하지 않는다.
                    // 특수키가 입력된 경우에는 나오지 않기 위해 중복 데이터 처리,
                    distinctUntilChanged(),
                    tap(v => console.log("from keyup$", v)),
                    share() //usersQuery$와 reset$에 공유하기 위해 hot observable로 변경한다.
                );

            /*
                partition에 의해 검색어가 길이가 있는 값은 user$ 로 흐르고
                없는 값은 reset$으로 흐른다.
             */
            let [usersQuery$, reset$] = partition(keyup$, query => query.trim().length > 0)

            /*
                   mergeMap -> switchMap사용 이유

                   github users를 검색할 때 네트워크가 느린 경우,
                  예를 들어 2번 요청할 때 첫번째 요청보다 두번째 요청의 응답이 먼저 오는 경우
                  첫번째 응답이 그 뒤 오게 되어 첫번째 요청 결과가 나타나게 될 수도 있는데
                  mergeMap을 써서 단순하게 flat하면 이 현상을 방지할 수 없고
             */
            let searchResultUser$ = usersQuery$
                .pipe(
                    tap(showLoading),
                    // ajax.getJSON()은 여러개의 observable을 반환하므로 switchMap으로 flat 해서 전달한다.
                    switchMap(query => ajax.getJSON<GitHubUserSearchResult>(`https://api.github.com/search/users?q=${query}`)),
                    tap(hideLoading),

                    //오류 발생시 n횟수동안 재시도를 해보고 이후에도 오류가 발생한다면 오류로 처리한다.
                    // 위처럼 api요청에 많이 쓰인다.
                    retry(2),

                    //재시도까지 오류로 처리될 경우에는 loading이 계속 보이는 것을 방지하기 위해 후처리 작업으로 hide를 등록
                    finalize(hideLoading),
                    tap(v => console.log("from user$", v))
                )

            //검색된 아이템 목록이 들어오면 동작하며
            //user목록에 데이터를 공급한다.
            searchResultUser$.subscribe({
                next: v => setUsers(v.items),
                error: e => {
                    console.error(e);
                    alert(e.message);
                }
            });

            /*
                빈 값이 들어오면 데이터가 흐른다.
                검색어가 없으므로 user 목록을 비운다
             */
            reset$
                .pipe(
                    tap(v => setUsers([])),
                    tap(v => console.log("from reset$", v))
                )
                .subscribe();
        }


    }, [])

    return (
        <>
            <p>사용자 검색</p>
            <div className={styles.autocomplete}>
                <input id="search"  type="input" ref={searchElRef} className={styles.search} placeholder="검색하고 싶은 사용자 아이디를 입력해주세요"></input>
                <ul id="suggestLayer" className={styles.suggestLayer}>
                    {
                        users.map((u,i) => {
                            return <UserLI key={i} user={u}></UserLI>
                        })
                    }
                </ul>
                <LoadingDiv isLoading={isLoading}>
                    <FontAwesomeIcon icon={faSpinner} className="fa-pulse"/>
                </LoadingDiv>
            </div>
        </>
    )
}