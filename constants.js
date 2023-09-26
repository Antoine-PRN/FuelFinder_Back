const REGEX_FORBIDDEN_CHARS = /[<>;'`"()&%$*+=\[\]{}|\\^]/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

module.exports = {
  REGEX_FORBIDDEN_CHARS,
  EMAIL_REGEX
}