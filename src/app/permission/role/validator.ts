export const ROLE_VALIDATOR = [

  {
    name: 'name',
    messages: {
      required: 'feature.error.name',
      minlength: 'feature.error.nameMin',
      pattern: 'feature.error.namePattern'
    }
  },

  {
    name: 'description',
    messages: {
      required: 'feature.error.description',
      minlength: 'feature.error.descriptionMin'

    }
  },
];
