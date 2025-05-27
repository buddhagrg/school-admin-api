export const pwdResetRequestTemplate = (link, expiry) => {
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
                <p>Reset your account password clicking the button below:</p>
                <p><a href=${link} class="btn">Reset password</a></p>

                <p>This link will expire in <strong>${expiry}</strong>.</p>

                <p>
                    Thank you,<br />
                    The School Admin Team
                </p>                
            </body>
        </html>
    `;
};
