import pkg from 'twilio';
const { Twilio } = pkg;

const {
  SERVER_TWILIO_ACCOUNT_SID,
  SERVER_TWILIO_AUTH_TOKEN,
  SERVER_TWILIO_SERVICE_SID
} = process.env;

export const startTwilioVerification = async (to: string, channel: string) => {
  try {
    const client = new Twilio(
      SERVER_TWILIO_ACCOUNT_SID,
      SERVER_TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(SERVER_TWILIO_SERVICE_SID)
      .verifications.create({ to: to, channel });

    return verification.sid;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const checkTwilioVerification = async (to: string, code: string) => {
  try {
    const client = new Twilio(
      SERVER_TWILIO_ACCOUNT_SID,
      SERVER_TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(SERVER_TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: to, code });

    return verification;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const twilio = {
  startTwilioVerification,
  checkTwilioVerification
};
