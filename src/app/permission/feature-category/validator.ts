export const FEATURE_CATEGORY_VALIDATOR = [

  {
    name: 'name',
    messages: {
      required: 'featureCategory.error.name',
      minlength: 'featureCategory.error.nameMin',
      duplicate: 'featureCategory.error.duplicate',
      pattern: 'featureCategory.error.namePattern'
    }
  },

  {
    name: 'translation',
    messages: {
      required: 'featureCategory.error.translation',
      minlength: 'featureCategory.error.translationMin'
    }
  },
  {
    name: 'icon',
      messages: {
        required: 'featureCategory.error.icon',
        minlength: 'featureCategory.error.iconMin'
      }
  },
  {
    name: 'state',
      messages: {
        required: 'featureCategory.error.state',
        minlength: 'featureCategory.error.stateMin'
      }
  },
  {
    name: 'description',
      messages: {
        required: 'featureCategory.error.description',
        minlength: 'featureCategory.error.descriptionMin'
      }
  },
];


export const FEATURE_VALIDATOR = [

  {
    name: 'name',
    messages: {
      required: 'feature.error.name',
      minlength: 'feature.error.nameMin',
      duplicate: 'feature.error.duplicate'
    }
  },

  {
    name: 'description',
    messages: {
      required: 'feature.error.description',
      minlength: 'feature.error.descriptionMin'

    }
  },
  {
    name: 'state',
    messages: {
      required: 'feature.error.state',
      minlength: 'feature.error.stateMin'

      }
    },

];
