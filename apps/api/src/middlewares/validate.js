import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { logger } from '../utils/logger.js';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const validate = (schema) => {
  const validateFn = ajv.compile(schema);
  
  return (req, res, next) => {
    const valid = validateFn(req.body);
    
    if (!valid) {
      return res.status(400).json({
        error: 'Validasyon hatası',
        details: validateFn.errors,
      });
    }
    
    next();
  };
};

