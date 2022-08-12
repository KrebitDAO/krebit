import express from 'express';
import cors from 'cors';

import {
  DeworkController,
  DiscordController,
  QuestappController
} from './controller';

const { SERVER_PORT } = process.env;

const app = express();
const router = express.Router();

router.use(cors()).use(express.json());

router
  .post('/questapp', QuestappController)
  .post('/discord', DiscordController)
  .post('/dework', DeworkController);

app.use('/', router);

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
