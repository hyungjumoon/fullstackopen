const Header = ({name}) => <h2>{name}</h2>

const Total = ({total}) => <p><b>total of {total} exercises</b></p>

const Part = ({label, value}) => <p>{label} {value}</p>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} label={part.name} value={part.exercises} />
      )}
    </div>
  )
}

const Course = ({course}) => {
  const total = course.parts.map(part => part.exercises).reduce((a,b) => a+b)
  
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course