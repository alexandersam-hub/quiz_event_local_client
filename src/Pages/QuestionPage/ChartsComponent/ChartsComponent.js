import React from 'react';
import s from './ChartsComponent.module.css'

const ChartsComponent = ({teamsName, score}) => {
    return teamsName && teamsName.length >0?(
            <div className={s.wrapper}>
                <div className={s.title}>Счет игры</div>
                    <table className={s.t_score}>
                        <tbody>
                            <tr>
                                <td/>
                                <td className={s.t_td_title}>Баллы <br/> за раунд</td>
                                <td className={s.t_td_title}>Итог</td>
                            </tr>
                            {teamsName.map((team, index)=>{
                                return(
                                    <tr key={'score_'+team.teamCode+index}>
                                        <td className={s.t_td_team_name}>{team}</td>
                                        <td className={s.t_td_value}>{score[index].current - score[index].last}</td>
                                        <td className={s.t_td_value}>{score[index].current}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            </div>

    ):(
        <></>
    )
};

export default ChartsComponent;