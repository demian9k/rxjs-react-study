import React, {useState, useEffect} from 'react'

import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import Autocomplete3 from './components/Autocomplete3/Autocomplete3'
import First from "./First";
import NotFound from "./NotFound";
import Carousel3 from "./components/Carousel3";
import {RxjsSubjectExample, RxjsSubjectExamples} from './components/Subjects/RxjsSubjectExample';
import {RxjsSchedulerExample, RxjsSchedulerExamples} from "./components/RxjsScheduler/RxjsSchedulerExample";
import {usingScanOperator} from "./components/usingObservable";

function App() {

    // usingReduceOperator()
    usingScanOperator()

    return (
        <div className="App">
            <div className="top-bar">
                <span className="link"><Link to="/">first</Link></span>
                <span className="link"><Link to="/autocomplete3"> autocomplete3 </Link></span>
                <span className="link"><Link to="/carousel3"> carousel3 </Link></span>
                <span className="link"><Link to="/rxjs-subject"> rxjs-subject </Link></span>
                <span className="link"><Link to="/rxjs-scheduler"> rxjs-scheduler </Link></span>
            </div>
            <main className="view">
                <Routes>
                    <Route path="/" element={<First/>}></Route>
                    <Route path="/autocomplete3" element={<Autocomplete3/>}></Route>
                    <Route path="/carousel3" element={<Carousel3/>}></Route>
                    <Route path="/rxjs-subject/*" element={<RxjsSubjectExamples/>}>
                        <Route path=":name" element={<RxjsSubjectExample/>}></Route>
                    </Route>
                    <Route path="/rxjs-scheduler/*" element={<RxjsSchedulerExamples/>}>
                        <Route path=":name" element={<RxjsSchedulerExample/>}></Route>
                    </Route>
                    <Route path="*" element={<NotFound/>}></Route>
                </Routes>
            </main>
        </div>
    )
}

export default App
