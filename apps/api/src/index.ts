import express from 'express';
import cors from 'cors';

import {
  DeworkController,
  DiscordController,
  QuestappController,
  TwitterController,
  VeriffController,
  IssuerController,
  SpectController,
  PhoneController,
  EmailController,
  GithubController,
  PersonaController
} from './controller';

const { SERVER_PORT } = process.env;

const app = express();
const router = express.Router();

router.use(cors()).use(express.json());

router
  .post('/questapp', QuestappController)
  .post('/discord', DiscordController)
  .post('/dework', DeworkController)
  .post('/twitter', TwitterController)
  .post('/veriff', VeriffController)
  .post('/issuer', IssuerController)
  .post('/spect', SpectController)
  .post('/phone', PhoneController)
  .post('/email', EmailController)
  .post('/github', GithubController)
  .post('/persona', PersonaController);

app.use('/', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
