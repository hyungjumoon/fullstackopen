import express from 'express';
import { calculateBmi } from './bmiCalculator';
const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});