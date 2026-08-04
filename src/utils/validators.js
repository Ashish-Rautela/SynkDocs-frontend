export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_REGEX,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  fullName: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },
  documentTitle: {
    required: 'Title cannot be empty',
    maxLength: {
      value: 120,
      message: 'Title is too long',
    },
  },
};
