class UsernameDuplicates extends Error {
  constructor(message) {
    super(message);
    this.name = 'Username duplicates';
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
  UsernameDuplicates,
  UserNotFound,
  InvalidInput
}