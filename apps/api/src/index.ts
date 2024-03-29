import express from 'express';
import cors from 'cors';

import {
  DeworkController,
  DiscordController,
  DelegatedController,
  TwitterController,
  VeriffController,
  IssuerController,
  SpectController,
  PhoneController,
  EmailController,
  GithubController,
  PersonaController,
  MetadataController,
  GuildController,
  StackController,
  JobsController,
  OpenAIController,
  NotifyController,
  CredController
} from './controller';

const { SERVER_PORT, SERVER_BASE_URL } = process.env;

const app = express();
const router = express.Router();

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

router.use(cors(corsOptions)).use(express.json());

router.get('/metadata/:tokenId', MetadataController);

router.get('/jobs', JobsController);

router
  .post('/delegated', DelegatedController)
  .post('/discord', DiscordController)
  .post('/dework', DeworkController)
  .post('/twitter', TwitterController)
  .post('/veriff', VeriffController)
  .post('/issuer', IssuerController)
  .post('/spect', SpectController)
  .post('/phone', PhoneController)
  .post('/email', EmailController)
  .post('/github', GithubController)
  .post('/persona', PersonaController)
  .post('/guild', GuildController)
  .post('/stack', StackController)
  .post('/openai', OpenAIController)
  .post('/notify', NotifyController)
  .post('/cred', CredController);

app.use('/', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
