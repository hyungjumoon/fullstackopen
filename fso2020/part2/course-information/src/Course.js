import React from 'react';

const Header = ({ name }) => {
  return (
    <h1>{name}</h1>
  )
}

const Part = ({part}) => {
  return (
    <p> 
      {part.name} {part.exercises}
    </p>    
  )
}

const Total = ({ course }) => {
  return <div><p>Number of exercises {course.parts.reduce(((a,b) => {return a + b.exercises}), 0)}</p></div>
}

const Content = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <div>
        {course.parts.map(part => 
          <Part key={part.id} part={part} />
        )}
      </div>
      <Total course={course} />
    </div>
  )
}

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map(course => 
        <Content key={course.id} course={course} />
      )}
    </div>
  )
}

export default Course