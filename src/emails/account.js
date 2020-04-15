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
            padding: 20px;
            justify-content: center;
            display: flex;
            font-family: 'Roboto', sans-serif;
          }
          #container {
            max-width: 1500px;
          }
          #header {
            padding: 5px;
            justify-content: center;
            display: flex;
            background-color: rgb(250, 250, 250);
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
            border-radius: 2%; 
          }
          #email-header {
            color: #293c92;
          }
          #body-text {
            padding: 20px;
            background-color: rgb(250, 250, 250);
            margin-top: 10px;
            border-radius: 2%; 
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
          }
          #logo {
            width: 300px;
            height: 200px;
          }
      </style>
      <body>
        <div id="container">
          <div id="header">
            <img id="logo" src="./logo.jpg" alt="Lu Legal Services Logo">
          </div>
          <div id="body-text">
            <h2 id="email-header">Welcome ${name}</h2>
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
            padding: 20px;
            justify-content: center;
            display: flex;
            font-family: 'Roboto', sans-serif;
          }
          #container {
            max-width: 1500px;
          }
          #header {
            padding: 5px;
            justify-content: center;
            display: flex;
            background-color: rgb(250, 250, 250);
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
            border-radius: 2%; 
          }
          #email-header {
            color: #293c92;
          }
          #body-text {
            padding: 20px;
            background-color: rgb(250, 250, 250);
            margin-top: 10px;
            border-radius: 2%; 
            box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
          }
          #logo {
            width: 300px;
            height: 200px;
          }
      </style>
      <body>
        <div id="container">
          <div id="header">
            <img id="logo" src="./logo.jpg" alt="Lu Legal Services Logo">
          </div>
          <div id="body-text">
            <h2 id="email-header">Goodbye ${name}</h2>
            <p>I hope to see you back sometime soon.</p>
          </div>
        </div>
      </body>
    `,
  };

  sgMail.send(cancelAccountMsg);
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationAccountEmail,
};
