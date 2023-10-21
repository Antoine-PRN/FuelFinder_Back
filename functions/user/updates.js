const { checkEmail } = require("../../controls");
const connectToDatabase = require("../../db");
const { UserNotFound, InvalidPassword, EmailDuplicates } = require("../../exceptions");
const { decodeJWT } = require("../../utils/jwt");
const bcrypt = require('bcrypt');

async function updateEmail(token, newEmail, previousEmail) {
  let connection;
  try {
    connection = connectToDatabase();
    checkEmail(newEmail);
    checkEmail(previousEmail);

    if (newEmail === previousEmail) {
      throw new EmailDuplicates('Emails must be different from the previous one');
    }

    const id_user = decodeJWT(token).id;

    // Vérifier si l'utilisateur existe
    const [user] = await connection.query('SELECT * FROM users WHERE id = ? AND email = ?', [id_user, previousEmail]);

    if (user.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mettre à jour l'e-mail de l'utilisateur
    await connection.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, id_user]);

    return { success: true, message: 'L\'e-mail a été mis à jour avec succès' };
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.end(); // Fermer la connexion à la base de données
    }
  }
}

async function updatePassword (token, oldPassword, newPassword, newPassword2) {
  let connection;

  try {
    connection = connectToDatabase();

    if (oldPassword !== newPassword) {
      throw new InvalidPassword('Passwords do not match')
    }

    const id_user = decodeJWT(token).id;

    const user = await connection.query('SELECT * from users WHERE id = ?', [id_user]);

    if (user.length === 0) {
      throw new UserNotFound('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user[0].password);
    if (!isPasswordCorrect) {
      throw new InvalidPassword('Invalid password');
    } 

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id_user])
    
    return { success: true, message: 'Le mot de passe a été mis à jour avec succès' };
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = {
  updateEmail,
  updatePassword
}