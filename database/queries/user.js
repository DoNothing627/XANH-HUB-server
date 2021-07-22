const { DB2 } = require("../index");
var validator = require("email-validator");

exports.logInUser = ({ username, password }) => {
  try {
    const db = await DB2;
    const wait = new Promise((res, ej) => {
      db.query(
        "select * from user where username=? and password=?;",
        [username, password],
        (err, data) => {
          if (err) throw err;

          res(data[0] || { err: "user not exist!" });
        }
      );
    });
    return await wait;
  } catch (e) {
    throw e;
  }
};

exports.signUpUser = ({ email, username, password, user }) => {
  try {
    const db = await DB2;
    const wait = new Promise((res, ej) => {
      db.query("select * from user where email= ?", [email], (err, data) => {
        if (err) throw err;
        // res(
        //   validator.validate("test@email.com") || {
        //     err: "Email is invalid or already taken!",
        //   }
        // );
        // res(data[0] && { err: "Email is invalid or already taken!" });
        if (!validator.validate(email) || data[0])
          res({ err: "Email is invalid or already taken!" });
      });
      db.query(
        "select * from user where username= ?",
        [username],
        (err, data) => {
          if (err) throw err;

          res(data[0] && { err: "Username already taken!" });
        }
      );
      db.query(
        "INSERT INTO user (email, username, password, user) VALUES ?",
        [email, username, password, user],
        (err, data) => {
          if (err) throw err;
          res.send("Successful");
        }
      );
    });
    return await wait;
  } catch (e) {
    throw e;
  }
};
