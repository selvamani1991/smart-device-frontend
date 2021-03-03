export const USER_VALIDATOR = [
  {
    name: 'firstName',
    messages: {
      required: 'user.error.firstName',
      minlength: 'user.error.minFirstName',
      pattern: 'user.error.firstNamePattern'
    }
  },
  {
    name: 'lastName',
    messages: {
      required: 'user.error.lastName',
      minlength: 'user.error.minLastName',
      pattern: 'user.error.lastNamePattern'
    }
  },
  {
      name: 'designation',
      messages: {
        required: 'user.error.designation',
        minlength: 'user.error.minLastName',
        pattern: 'user.error.designationPattern'
      }
  },
  {
    name: 'email',
    messages: {
      required: 'user.error.emailRequired',
      //email: 'user.error.email',
      pattern: 'user.error.emailPattern',
      duplicate: 'user.error.duplicateEmail'
    }
  },
  {
    name: 'username',
    messages: {
      required: 'user.error.username',
      minlength: 'user.error.minUserName',
      pattern: 'user.error.usernamePattern',
      duplicate: 'user.error.duplicateUsername'
    }
  },
  {
      name: 'gender',
      messages: {
        required: 'user.error.gender',

      }
  },
  {
      name: 'otp',
      messages: {
        required: 'user.error.otp',

      }
  },
  {
    name: 'secondary',
    messages: {
      required: 'user.error.secondary',

    }
  },
  {
    name: 'password',
    messages: {
      required: 'user.error.password',
      minlength: 'user.error.minPassword'
    }
  },
  {
    name: 'confirmPassword',
    messages: {
      required: 'user.error.confirmPassword',
      minlength: 'user.error.minConfirmPassword',
      match: 'user.error.sameConfirmPassword'
    }
  },
  {
      name: 'tempPassword',
      messages: {
        required: 'user.error.tempPassword',
        minlength: 'user.error.minTempPassword',
        match: 'user.error.error'
      }
  },
  {
    name: 'phoneNo',
    messages: {
      required: 'user.error.phoneNo',
      duplicate: 'user.error.duplicatePhoneNo',
      minlength: 'user.error.minPhoneNumber',
      pattern: 'user.error.phoneNoPattern'
    }
  }

];
