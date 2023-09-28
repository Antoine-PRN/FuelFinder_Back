const { REGEX_FORBIDDEN_CHARS, EMAIL_REGEX } = require("../utils/constants");
const { InvalidInput } = require("../exceptions");

function checkInput(...args) {
  for (const inputProvided of args) {
    // Vérifier les caractères interdits
    if (REGEX_FORBIDDEN_CHARS.test(inputProvided)) {
      throw new InvalidInput('Forbidden Characters');
    }
  }
}

function checkEmail(...args) {
  for (const inputProvided of args) {
    if (!EMAIL_REGEX.test(inputProvided)) { 
      throw new InvalidInput('Invalid Email');
    }
  }
}


module.exports = {
  checkInput,
  checkEmail
}