export const accountVerificationInviteTemplate = (link) => {
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
                <p>Thank you for attending our demo session. We hope you found it helpful!</p>
                <p>If you're interested in using the system, please confirm by clicking the button below:</p>
                <p><a href=${link} class="btn">Yes, I am Interested</a></p>
                <p>If you have any questions, feel free to reach out.</p>
                <p>
                    Best,<br />
                    The School Admin Team
                </p>
            </body>
        </html>
    `;
};
