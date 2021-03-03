export const CITY_VALIDATOR = [
    {
          name: "name",
          messages: {
            required: "city.error.name",
            minlength: "city.error.minName",
            duplicate: "city.error.duplicate",
            verified: "city.error.verified",
            pattern: "city.error.namePattern"
          }
    },


    {
            name: "description",
            messages: {
                required: "city.error.description",
                minlength: "city.error.minDescription",
                verified: "city.error.verified"
            }

    },

    {
            name: "country",
            messages: {
                required: "city.error.country",
                minlength: "city.error.minCountry",
                verified: "city.error.verified"
            }

    }

];