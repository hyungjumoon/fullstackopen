interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDesc extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDesc {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDesc {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDesc {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];

// interface CourseProps {
//   name: string;
//   exerciseCount: number;
// }

const Header = ({ name }: { name: string }) => (
  <h1>{name}</h1>
);

const Part = ({coursePart} : { coursePart: CoursePart }) => {
  switch(coursePart.kind) {
    case "basic":
      return (<p>
        <b>{coursePart.name} {coursePart.exerciseCount}</b> <br />
        <i>{coursePart.description}</i>
      </p>);
    case "group":
      return (<p>
        <b>{coursePart.name} {coursePart.exerciseCount}</b> <br />
        project exercises {coursePart.groupProjectCount}
      </p>);
    case "background":
      return (<p>
        <b>{coursePart.name} {coursePart.exerciseCount}</b> <br />
        <i>{coursePart.description}</i> <br />
        link to {coursePart.backgroundMaterial}
      </p>);
    case "special":
      return (<p>
        <b>{coursePart.name} {coursePart.exerciseCount}</b> <br />
        <i>{coursePart.description}</i> <br />
        required skills {coursePart.requirements.join(', ')}
      </p>);
    default:
      return <div></div>;
  }
}

const Content = ({ courseParts } : { courseParts: CoursePart[] }) => (
  <div>
    {courseParts.map(course => <Part coursePart={course} />)}
  </div>
);

const Total = ({ totalExercises }: { totalExercises: number }) => (
  <p>
    Number of exercises {totalExercises}
  </p>
);

const App = () => {
  const courseName = "Half Stack application development";
  // const courseParts = [
  //   {
  //     name: "Fundamentals",
  //     exerciseCount: 10
  //   },
  //   {
  //     name: "Using props to pass data",
  //     exerciseCount: 7
  //   },
  //   {
  //     name: "Deeper type usage",
  //     exerciseCount: 14
  //   }
  // ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises}/>
    </div>
  );
};

export default App;