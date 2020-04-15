const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRID_API_KEY); // string
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const welcomeMsg = {
    to: email,
    from: 'baijin2011@gmail.com',
    subject: 'Thanks for joining in!',
    html: `
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      </head>
      <style>
          body {
          margin: 2rem auto;
          width: 80%;
          font-family: 'Roboto', sans-serif;
          }
          .container {
            max-width: 1500px;
          }
          .header {
            padding: 5px;
            justify-content: center;
            display: flex;
            background-color: rgb(250, 250, 250);
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
            border-radius: 2%; 
          }
          .email-header {
            color: #293c92;
          }
          .body-text {
            padding: 20px;
            background-color: rgb(250, 250, 250);
            margin-top: 10px;
            border-radius: 2%; 
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
          }
          img.logo {
            max-width: 100% !important;
          }
      </style>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="./logo.jpg" alt="Lu Legal Services Logo">
          </div>
          <div class="body-text">
            <h2 class="email-header">Welcome ${name}</h2>
            <p>Welcome to join us and enjoy our online appointment booking system.</p>
          </div>
        </div>
      </body>
    `,
  };

  sgMail.send(welcomeMsg);
};

const sendCancelationAccountEmail = (email, name) => {
  const cancelAccountMsg = {
    to: email,
    from: 'baijin2011@gmail.com',
    subject: 'Sorry to see you go!',
    html: `
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      </head>
      <style>
        body {
          margin: 2rem auto;
          width: 80%;
          font-family: 'Roboto', sans-serif;
        }
        .container {
          max-width: 1500px;
        }
        .header {
          padding: 5px;
          justify-content: center;
          display: flex;
          background-color: rgb(250, 250, 250);
          box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
          border-radius: 2%; 
        }
        .email-header {
          color: #293c92;
        }
        .body-text {
          padding: 20px;
          background-color: rgb(250, 250, 250);
          margin-top: 10px;
          border-radius: 2%; 
          box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
        }
        img.logo {
          max-width: 100% !important;
        }
      </style>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="./logo.jpg" alt="Lu Legal Services Logo">
          </div>
          <div class="body-text">
            <h2 class="email-header">Goodbye ${name}</h2>
            <p>I hope to see you back sometime soon.</p>
          </div>
        </div>
      </body>
    `,
  };

  sgMail.send(cancelAccountMsg);
};

const sendPasswordResetEmail = (email, name, newPassword) => {
  const passwordResetMsg = {
    to: email,
    from: 'baijin2011@gmail.com',
    subject: 'Password Reset',
    html: `
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      </head>
      <style>
        body {
          margin: 2rem auto;
          width: 80%;
          font-family: 'Roboto', sans-serif;
        }
        .container {
          max-width: 1500px;
        }
        .header {
          padding: 5px;
          justify-content: center;
          display: flex;
          background-color: rgb(250, 250, 250);
          box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
          border-radius: 2%; 
        }
        .email-header {
          color: #293c92;
        }
        .body-text {
          padding: 20px;
          background-color: rgb(250, 250, 250);
          margin-top: 10px;
          border-radius: 2%; 
          box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
        }
        img.logo {
          max-width: 100% !important;
        }
      </style>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="./logo.jpg" alt="Lu Legal Services Logo">
          </div>
          <div class="body-text">
            <h2 class="email-header">Password Reset</h2>
            <p>Hello ${name},</p>
            <p>Your password has been reset.</p>
            <br />
            <p>Your new password is: <strong>${newPassword}</strong></p>
            <p>You could log in to your account using the new password. You could also modify the password at "Edit Profile" page when logged in.</p>
          </div>
        </div>
      </body>
    `,
  };
  sgMail.send(passwordResetMsg);
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationAccountEmail,
  sendPasswordResetEmail,
};
