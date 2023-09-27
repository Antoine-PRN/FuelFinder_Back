class EmailDuplicates extends Error {
  constructor(message) {
    super(message);
    this.name = 'Email duplicates';
  }
}

class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'User not found';
  }
}

// Functionnal Controls Errors
class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid input';
  }
}

module.exports = {
  EmailDuplicates,
  UserNotFound,
  InvalidInput
}