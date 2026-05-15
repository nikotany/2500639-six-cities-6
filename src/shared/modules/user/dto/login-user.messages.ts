export const CreateLoginUserMessages = {
  email: {
    invalidFormat: 'email must be valid address'
  },

  password: {
    lengthFiend: 'min length is 6, max length is 12',
    invalidFormat: 'password is required'
  }
} as const;
