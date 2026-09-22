import React from 'react'
import {useState} from 'react'

const Header=(props)=>{
    return(
        <h2> {props.heading} </h2>
    )
}

const Button=()=>{
    
    const[good,setGood]=useState(0)
    const[neutral,setNeutral]=useState(0)
    const[bad,setBad]=useState(0)
 const total= good+ neutral + bad
    const average=(good-bad)/total||0
    const positive=good/total*100||0
    return(
        <>
       
     <button  onClick={()=>setGood(good+1)}> good </button>  
     <button  onClick={()=>setNeutral(neutral+1)}> neutral </button>  
     <button  onClick={()=>setBad(bad+1)}> bad </button> 
     <h2> Statistics </h2>
     {total === 0 && <p>No feedback given</p>}
     {total > 0 && (
        <>
     <p> good :{ good } </p>
        <p> neutral : { neutral}</p>
        <p> bad: { bad}</p>
         <p> total: { total}</p>
          <p> average: { average}</p>
          <p> positive: {positive }</p>
          </>
     )
    }
        
        

 
     </>
     
    )
}

const App=()=>{
    return(
        <div>
        <Header heading='give feedback' />
        <Button />
        
        </div>
    )
}
export default App