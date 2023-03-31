// @eslint-ignore
const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
      }
      header {
        background-color: #8b0000;
        color: #fff;
        padding: 20px;
      }
      h1 {
        margin: 0;
        font-size: 32px;
        text-align: center;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .center {
        text-align: center;
      }
      p {
        margin: 0 0 20px 0;
        font-size: 18px;
        line-height: 1.5;
      }
      a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #8b0000;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      a:hover {
        background-color: #b20000;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>ReadLess: Verify Your Email</h1>
    </header>
    <div class="container">
      <p>
        Thank you for signing up! To complete your registration, please click
        the button below to verify your email address:
      </p>
      <p class="center">
        <a href="https://{{domain}}/verify?vc={{verificationCode}}">Verify Email</a>
      </p>
      <p>If you did not create an account, please disregard this message.</p>
    </div>
  </body>
</html>
`;
export default html;