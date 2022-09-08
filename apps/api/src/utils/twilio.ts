import pkg from 'twilio';
const { Twilio } = pkg;

const {
  SERVER_TWILIO_ACCOUNT_SID,
  SERVER_TWILIO_AUTH_TOKEN,
  SERVER_TWILIO_PHONE_SERVICE_SID
} = process.env;

export const startPhoneVerification = async (
  phoneNumber: string,
  channel: string
) => {
  try {
    const client = new Twilio(
      SERVER_TWILIO_ACCOUNT_SID,
      SERVER_TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(SERVER_TWILIO_PHONE_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel });

    return verification.sid;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};

export const checkPhoneVerification = async (
  phoneNumber: string,
  code: string
) => {
  try {
    const client = new Twilio(
      SERVER_TWILIO_ACCOUNT_SID,
      SERVER_TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(SERVER_TWILIO_PHONE_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code });

    return verification;
  } catch (err) {
    console.log('err: ', err);
    throw new Error(err);
  }
};
