interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
};

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
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}