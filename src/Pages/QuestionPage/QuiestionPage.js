import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'
import questionState from "../../State/Questions/QuestionState";
import QuestionComponent from "./QuestionComponent/QuestionComponent";
import {getDebugName, set, toJS} from "mobx";
import {observer} from "mobx-react-lite";
import NavBarChoiceQuestions from "../Static/NavBarChoiceQuestions";
import Loader from "../../Static/Loader/Loader";
import s from './questionPage.module.css'
import Cookie from 'js-cookie'
import ScoreModal from "./ScoreModal/ScoreModal";
import config from "../../config";
import FinalPage from "./FinalPage/FinalPage";


const QuestionPage =() => {
    const {id, room} = useParams();

    const [isLoad, setIsLoad] = useState(false)
    const [finalScore, setFinalScore] = useState({})
    const [isStart, setIsStart] = useState(false)
    const [isFinish, setIsFinish] = useState(false)
    const [isVisibleFinalPage, setIsVisibleFinalPage] = useState(false)
    const [currentTask, setCurrentTask]= useState(0)
    const [countPlayersInTeam, setCountPlayersInTeam] = useState({})
    const [currentScore, setCurrentScore] = useState({})
    const [currentAnswers, setCurrentAnswers] = useState({})
    // const [lastScore, setLastScore] = useState({})
    const [quiz, setQuiz] = useState({})
    const [question, setQuestion] = useState({})
    const [ws, setWs] = useState({})
    const [teams, setTeams] = useState({})
    const [mes, setMes] = useState('')
    const [score, setScore] = useState({})
    const [answers, setAnswers] = useState({})
    const [countPlayerAnswer, setCountPlayerAnswer] = useState({})
    const [isViewReport, setIsViewReport] = useState(false)
    const [isViewModalScore, setIsViewModalScore] = useState(false)
    const [viewAnswer, setViewAnswer] = useState(false)
    const init=()=>{
        setIsLoad(false)
        window.scrollBy(0,-110);
        const myWs = new WebSocket(config.SERVER_SOCKET);
        myWs.onopen = function () {
            console.log('подключился');
            myWs.send(JSON.stringify({action: 'login', type:'game', room, quiz:id}));
        };
        myWs.onclose = ()=>{
            console.log('соединие закрылось' )
            init()
        }
        myWs.onmessage = function (message) {
            const data = JSON.parse( message.data)
            console.log("Message", data);
            switch (data.action) {
                case 'get_score':

                    if (data.stepRound && data.stepRound === 'finish') {
                        console.log('@!@@', data.stepRound)
                        setFinalScore({teamsName:data.teamsName, score:data.score})
                        setIsViewModalScore(false)
                        setIsVisibleFinalPage(true)


                    }
                    break
                case 'score':
                    if(data.stepRound === 'score')
                        setIsViewModalScore(true)
                    break
                case 'game':
                    if (data.currentTask!==currentTask)
                        setViewAnswer(false)
                    const currentQuestion= {...data.question}
                    console.log('!!!!!!!!!!!', currentQuestion)
                    currentQuestion.img = currentQuestion.img.replace('https://quizserver.vityazgroup.ru:8500', config.URL_SERVER)
                    setQuestion(currentQuestion)
                    setIsStart(data.isStart)
                    setQuiz(data.quiz)
                    setCurrentTask(data.currentTask)
                    setScore(data.score)

                    break
                case 'score_admin':
                    console.log('score_admin')
                    setCountPlayersInTeam(data.room.countsPlayerList)
                    setCountPlayerAnswer(data.room.countPlayerAnswer)
                    setCurrentAnswers(data.room.logAnswers[data.room.currentTask])
                    setTeams(data.room.teamsCode)
                    setScore(data.room.score)
                    setIsViewReport(true)
                    if (data.room.stepRound === 'score')
                        setIsViewModalScore(true)
                    else
                        setIsViewModalScore(false)
                    break
            }

        };
        setWs(myWs)

        setIsLoad(true)
    }

    if (Object.keys(ws) >0 && ws.readyState!==1){
        console.log('Reload init!!!!')
        init()
    }

    const start = ()=>{
        ws.send(JSON.stringify({action: 'start', type:'game', room, quiz:id}));
    }
    const nextQuestion = ()=>{
        setIsViewModalScore(false)
        ws.send(JSON.stringify({action: 'next', room, quiz:id}));
        setIsViewReport(false)
    }
    const viewScore = ()=>{
        setIsViewModalScore(true)
        ws.send(JSON.stringify({action:'view_score', room, quiz:id}))
        console.log('view_score')
    }
    const closeQuiz = ()=>{
        setIsViewModalScore(true)
        ws.send(JSON.stringify({action:'view_score', room, quiz:id}))
        console.log('view_score')
        setIsFinish(true)
    }

        const finishQuiz = ()=>{
            console.log('finishQuiz')
            ws.send(JSON.stringify({action:'finish', room, quiz:id}))
        }

    const getArrTeamsName=()=>{
        const teamsList = []
        teams.forEach(team=>teamsList.push(team.teamName))
        return teamsList
    }

    const getArrScore=()=>{
        const scoreList = []

        teams.forEach(team=>{scoreList.push({
            current: Math.round(score[team.teamCode] && score[team.teamCode].current? score[team.teamCode].current:0),
            last:    score[team.teamCode] && score[team.teamCode].last? score[team.teamCode].last:0
        })


        })
        // console.log(teams.length, scoreList.length)
        return scoreList
    }
    useEffect(()=>{
      init()
    },[])

    return !isVisibleFinalPage?(
            <>
            <NavBarChoiceQuestions/>

            <div className={s.wrapper}>
             
            {isLoad?
            <div className={s.bodyAsk}>
                  
                {isStart?
                  <div>

                      {/*{teams.length>0?*/}
                      {/*    <div>*/}
                      {/*        {isViewReport && teams.map((team, index)=>{*/}
                      {/*            // console.log(countPlayerAnswer)*/}
                      {/*            return(*/}
                      {/*              <div key={'team_name_'+index}>{team.teamName} <span>{countPlayerAnswer && countPlayerAnswer[team.teamCode]?countPlayerAnswer[team.teamCode]:0} / {countPlayersInTeam && countPlayersInTeam[team.teamCode]?countPlayersInTeam[team.teamCode]:0}</span></div>*/}
                      {/*        )})}*/}
                      {/*        {teams.map((team, index)=>{*/}
                      {/*            return(*/}
                      {/*                <div key={'team_score_'+index}>{team.teamName} <span> {score[team.teamCode]&&score[team.teamCode].last?score[team.teamCode].last:0}</span></div>*/}
                      {/*            )})}*/}
                      {/*    </div>:<></>*/}
                      {/*}*/}

                    <QuestionComponent
                                       viewAnswer={viewAnswer}
                                       setViewAnswer={setViewAnswer}
                                       closeQuiz={closeQuiz}
                                       nextQuestion={viewScore}
                                       taskNumber={currentTask}
                                       quizName={quiz.title}
                                       question={question}/>
                  </div>
                                   :
                <div className={s.message_not_question}>
                   <div className={s.start_text}>Все готовы? <br/> Начнем!</div>
                   <div className={s.btn_start} onClick={()=>{start()}}>Старт</div>
                </div>
                }
                {isViewModalScore?<ScoreModal finishQuiz={finishQuiz} isFinish={isFinish} teamsName={getArrTeamsName()} score={getArrScore()} closeModal={nextQuestion}/>:<></>}
            </div>:
                <Loader/>
            }


        </div>
        </>):(
            <>
                <NavBarChoiceQuestions/>
                <FinalPage finalScore={finalScore}/>
            </>
    )
}

export default QuestionPage;