export const directAccessRequestApproved = (link) => {
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
                We are pleased to inform you that your request for system access has been approved.
                To complete your registration, please set up your account password by clicking the link below:
                
                <br />
                <a href=${link} class="btn">Set Up Password</a>

                <p>
                    This link will expire in 48 hours.
                     If you did not request access, please contact our support team immediately.
                </p>

                <p>
                    Best,<br />
                    The School Admin Team
                </p>
            </body>
        </html>
      `;
};