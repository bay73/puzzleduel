var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

var email = "andrey.iv.bogdanov@gmail.com"
var newToken = 100

var mailOptions = {
  from: "PuzzleDuel<puzzleduel.club@gmail.com>",
    to: email,
          subject: "Reset password for www.PuzzleDuel.club",
          text: "You or somebody else recently requested to reset your password for account " + email
          + " at web site http://www.puzzleduel.club \n\n"
          + "Click the following link http://www.puzzleduel.club/users/reset/" + newToken
          + " and enter the new password. "
          + "The link is valid for the next two hours. \n\n"
          + "If you didn't request a password reset, please just ignore this email. \n\n"
          + "Write to puzzleduel.club@gmail.com if you have any questions. \n\n\n"
          + "Thanks,\n"
          + "Andrey"
        };

mailgun.messages().send(data, (error, body) => {
  console.log(body);
});

