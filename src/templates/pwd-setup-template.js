export const pwdSetupTemplate = (link, expiry) => {
  return `
        <html>
            <head>
                <style>
                .btn {
                    background-color: #04AA6D;
                    border: none;
                    color: white !important;
                    padding: 10px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 10px 0px;
                }
                </style>
            </head>
            <body>
                Hi there,
                <p>Your email has been successfully verified. To complete your account setup, please set your password by clicking the button below:</p>
                <p><a href=${link} class="btn">Setup password</a></p>
                <p>If you did not request this, please disregard this email.</p>

                <p>This link will expire in <strong>${expiry}</strong>.</p>

                <p>
                    Thank you,<br />
                    The School Admin Team
                </p>                
            </body>
        </html>
    `;
};
