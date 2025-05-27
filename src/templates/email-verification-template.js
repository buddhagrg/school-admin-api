export const emailVerificationTemplate = (link, expiry) => {
  return `
        <html>
            <head>
                <style>
                .btn {
                    background-color: #04AA6D;
                    border: none;
                    color: white !important;
                    padding: 8px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                    cursor: pointer;
                    margin: 10px 0px;
                }
                </style>
            </head>
            <body>
                <p>Hi there,</p>
                Thank you for requesting access to School Admin. To complete your registration and activate your account, please verify your email address by clicking the button below:
                
                <br />
                <a href=${link} class="btn">Verify Email Address</a>

                <p>
                    This link will expire in <strong>${expiry}</strong>.
                    If you did not initiate this request, please ignore this email.
                </p>

                <p>
                    Thank you,<br />
                    The School Admin Team
                </p>
            </body>
        </html>
    `;
};
