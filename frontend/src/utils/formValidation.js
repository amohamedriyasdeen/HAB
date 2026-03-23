// Normalize any value to check emptiness
const isEmpty = (val) => {
  if (val === null || val === undefined || val === false) return true;
  if (Array.isArray(val)) return val.length === 0;
  return !String(val).trim();
};

export const validators = {
  required:      (label) => (val) => isEmpty(val) ? `${label} is required` : null,
  email:         (label) => (val) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val ?? '').trim()) ? `${label} is not a valid email` : null,
  emailDomain:   (label, domains) => (val) => !domains.includes(String(val ?? '').trim().split('@')[1]) ? `${label} must be from: ${domains.join(', ')}` : null,
  onlyNumbers:   (label) => (val) => !/^\d+$/.test(String(val ?? '').trim()) ? `${label} must contain only numbers` : null,
  minLength:     (label, min) => (val) => String(val ?? '').trim().length < min ? `${label} must be at least ${min} characters` : null,
  maxLength:     (label, max) => (val) => String(val ?? '').trim().length > max ? `${label} must not exceed ${max} characters` : null,
  minSelected:   (label, min) => (val) => (Array.isArray(val) ? val.length : 0) < min ? `${label} requires at least ${min} selection${min > 1 ? 's' : ''}` : null,
  maxSelected:   (label, max) => (val) => (Array.isArray(val) ? val.length : 0) > max ? `${label} allows at most ${max} selection${max > 1 ? 's' : ''}` : null,
  passwordMatch: (confirmVal) => (val) => val !== confirmVal ? 'Passwords do not match' : null,
};

// schema: { fieldName: [validatorFn, ...] }
export const validateSchema = (schema, data) =>
  Object.entries(schema).reduce((errors, [field, rules]) => {
    for (const rule of rules) {
      const error = rule(data[field]);
      if (error) { errors[field] = error; break; }
    }
    return errors;
  }, {});

export const hasErrors = (errors) => Object.keys(errors).length > 0;
