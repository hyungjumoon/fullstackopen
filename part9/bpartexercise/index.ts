import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  let h : number, w : number;
  if (!req.query) {
    res.send({error : "malformatted parameters"});
  }
  const { query } = req;
  if (isNaN(Number(query.height)) || isNaN(Number(query.weight))) {
    res.send({error : "malformatted parameters"});
  } else {
    h = Number(query.height);
    w = Number(query.weight);
    res.send({
      weight: w,
      height: h,
      bmi: calculateBmi(h, w)
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target } = req.body;

  if ( !target || !daily_exercises) {
    res.status(400).send({ error: 'missing parameters'});
    return;
  }
  if (isNaN(Number(target))) {
    res.status(400).send({ error: 'malformatted parameter'});
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tmp = daily_exercises as any[];
  let flag : boolean = false;
  tmp.forEach(a => flag &&= isNaN(Number(a)));
  if (flag) {
    res.status(400).send({ error: 'malformatted parameter'});
    return;
  }
  const input : number[] = new Array(tmp.length) as number[];
  for(let i=0; i<tmp.length; i++) {
    input[i] = Number(tmp[i]);
  }
  res.send(calculateExercises(input, Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});