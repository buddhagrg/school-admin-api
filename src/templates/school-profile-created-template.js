const schoolProfileCreatedTemplate = (schoolId, schoolName) => {
  return `
        <html>
            <body>
                <h4>Welcome to school admin!</h4>
                <div>Your school profile has been created.</div>
                <br />
                <span>School ID: <strong>${schoolId}</strong></span>
                <br />
                <span>School Name: <strong>${schoolName}</strong></span>
            </body>
        </html>
    `;
};

module.exports = { schoolProfileCreatedTemplate };
