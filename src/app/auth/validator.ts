export const AUTH_VALIDATOR = [

    {
        name: "username",
        messages: {
            required: "login.error.username",
            minlength: "login.error.minUsername",
            verified: "login.error.verified"
        }
    },

    {
        name: "password",
        messages: {
            required: "login.error.password",
            verified: "login.error.verified"
        }
    },

];