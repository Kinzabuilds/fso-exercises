import  React from 'react'

const Header =({course})=>{
   
  return(
 <p>{course}</p> 
  )
}
const Parts=({parts})=>{
  return(
    <p>
    {parts[0].exercises} {parts[0].name}
    </p>
  )
}
const App=()=>{
  const course='half stack development'
  const note={
     parts:[
      {
      name: ' react',
      exercises:10
      }
     ]
    };
  return(
    <>
    <Header course={course} />
    <Parts parts={note.parts} />
    </>
    
  )

}
export default App