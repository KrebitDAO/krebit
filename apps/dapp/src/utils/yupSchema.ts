import * as yup from 'yup';

import { constants } from './constants';

interface IConfig {
  name: string;
  validationType?: string;
  validations?: {
    type: string;
    params: any[];
  }[];
}

const createYupSchema = (schema: any, config: IConfig) => {
  const { name, validationType, validations = [] } = config;

  if (!yup[validationType]) {
    return schema;
  }

  let validator = yup[validationType]();

  validations.forEach(validation => {
    const { params, type } = validation;

    if (!validator[type]) {
      return;
    }

    validator = validator[type](...params);
  });

  schema[name] = validator;

  return schema;
};

const validateYupSchema = async (fields: any[], formValues: any) => {
  try {
    const createSchema = fields.reduce(createYupSchema, {});
    const yupSchema = yup.object().shape(createSchema);

    await yupSchema.validate(formValues);
  } catch (error) {
    console.error(error);
    return {
      error:
        error?.message ||
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL
    };
  }
};

export const yupSchema = {
  createYupSchema,
  validateYupSchema
};
