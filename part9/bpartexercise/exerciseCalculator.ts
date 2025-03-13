interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
};

interface ExerciseValues {
  values: number[];
  target: number;
}

const parseNumbers = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  var target : number;
  if (!isNaN(Number(args[2]))) {
    target = Number(args[2])
  }
  console.log(target)
  var i : number = 3;
  var nums:number[] = new Array(args.length-3)  
  for(i; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {
      nums[i-3] = Number(args[i])
    } else {
      throw new Error('Provided values were not numbers!');
    }
  }
  return {values: nums, target: target}
}

const calculateExercises = (a: number[], t: number) : Object => {
  let ans: Result = {
    periodLength: a.length,
    trainingDays: a.filter(i => i > 0).length,
    success: false,
    rating: 1,
    ratingDescription: 'under the target',
    target: t,
    average: a.reduce((acc: number, cur: number) => acc + cur, 0) / a.length
  }
  if (ans.average >= t) {
    ans.success = true;
    ans.rating = 2;
    ans.ratingDescription = 'reached the target';
    if (ans.average > t) {
      ans.rating = 3;
      ans.ratingDescription = 'exceeded the target';
    }
  }
  return ans;
}

try {
  const { values, target } = parseNumbers(process.argv);
  // console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
  console.log(calculateExercises(values, target));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}