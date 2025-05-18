export const pwdSetupTemplate = (link) => {
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
                    <p>Set up your account password using the button below:</p>
                    <p><a href=${link} class="btn">Setup password</a></p>
                    <p>
                        Best,<br />
                        The School Admin Team
                    </p>                
                </body>
            </html>
            `;
};
