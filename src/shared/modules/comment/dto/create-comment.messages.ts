export const CreateCommentMessages = {
  text: {
    lengthField: 'min length is 5, max length is 1024',
    invalidFormat: 'text is required',
  },

  rating: {
    invalidFormat: 'rating is required',
    rangeField: 'min rating is 1, max rating is 5'
  },
} as const;
