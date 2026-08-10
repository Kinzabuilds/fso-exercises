function Header(props) {
  return (
    <h2>{props.name}</h2>
  )
}

function Part(props) {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

function Content(props) {
  let total = 0
  props.parts.forEach(part => {
    total += part.exercises
  })

  return (
    <div>
      {props.parts.map(part => {
        return (
          <Part key={part.id} part={part} />
        )
      })}
      <p>
        <strong>total of {total} exercises</strong>
      </p>
    </div>
  )
}

function Course(props) {
  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      {courses.map(course => {
        return (
          <Course key={course.id} course={course} />
        )
      })}
    </div>
  )
}

export default App