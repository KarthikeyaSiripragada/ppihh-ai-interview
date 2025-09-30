import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import interviewerRouter from './routes/interviewer';
import intervieweeRouter from './routes/interviewee';
import interviewsRouter from './routes/interviews';
import applicationsRouter from './routes/applications';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, message: 'Interview backend (TS) online' }));

app.use('/api/interviewers', interviewerRouter);
app.use('/api/interviewees', intervieweeRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/applications', applicationsRouter);

const port = process.env.PORT || 8080;
app.listen(Number(port), () => {
  console.log(`Server listening on ${port}`);
});
