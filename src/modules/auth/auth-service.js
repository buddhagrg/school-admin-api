const { ApiError, generateToken, generateCsrfHmacHash, getAccessItemHierarchy, verifyToken, sendPasswordSetupEmail, verifyPassword, generateHashedPassword } = require("../../utils");
const { findUserByUsername, invalidateRefreshToken, findUserByRefreshToken, getMenusByRoleId, getRoleNameByRoleId, findUserByRole, saveUserLastLoginDate, deleteOldRefreshTokenByUserId, isEmailVerified, verifyAccountEmail, doesEmailExist, setupUserPassword } = require("./auth-repository");
const { v4: uuidV4 } = require("uuid");
const { env, db } = require("../../config");
const { insertRefreshToken } = require("../../shared/repository");

const login = async (username, passwordFromUser) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const user = await findUserByUsername(username, client);
        if (!user) {
            throw new ApiError(400, "Invalid credential");
        }

        const { id: userId, role_id, name, email, password: passwordFromDB, is_active } = user;
        if (!is_active) {
            throw new ApiError(403, "Your account is disabled");
        }

        await verifyPassword(passwordFromDB, passwordFromUser);

        const roleName = await getRoleNameByRoleId(role_id, client);
        const csrfToken = uuidV4();
        const csrfHmacHash = generateCsrfHmacHash(csrfToken);
        const accessToken = generateToken(
            { id: userId, role: roleName, csrf_hmac: csrfHmacHash },
            env.jwtAccessTokenSecret,
            env.jwtAccessTokenTimeInMS
        );
        const refreshToken = generateToken(
            { id: userId, role: roleName, },
            env.jwtRefreshTokenSecret,
            env.jwtRefreshTokenTimeInMS
        );

        await deleteOldRefreshTokenByUserId(userId, client);
        await insertRefreshToken({ userId, refreshToken }, client);
        await saveUserLastLoginDate(userId, client);

        const role = await getRoleNameByRoleId(role_id, client);

        const menus = await getMenusByRoleId(role_id, client);
        const hierarchialMenus = getAccessItemHierarchy(menus);

        await client.query("COMMIT");

        const accountBasic = {
            id: userId,
            name,
            email,
            role,
            menus: hierarchialMenus
        };

        return { accessToken, refreshToken, csrfToken, accountBasic };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const logout = async (refreshToken) => {
    const affectedRow = await invalidateRefreshToken(refreshToken);
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to logout");
    }
    return { message: "Logged out successfully" };
};

const getNewAccessAndCsrfToken = async (refreshToken) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const decodedToken = verifyToken(refreshToken, env.jwtRefreshTokenSecret);
        if (!decodedToken || !decodedToken.id) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const user = await findUserByRefreshToken(refreshToken);
        if (!user) {
            throw new ApiError(401, "Refresh token does not exist");
        }

        const { id: userId, role_id, is_active } = user;
        if (!is_active) {
            throw new ApiError(401, "Your account is disabled");
        }

        const roleName = await getRoleNameByRoleId(role_id, client);
        const csrfToken = uuidV4();
        const csrfHmacHash = generateCsrfHmacHash(csrfToken);
        const accessToken = generateToken(
            { id: userId, role: roleName, csrf_hmac: csrfHmacHash },
            env.jwtAccessTokenSecret,
            env.jwtAccessTokenTimeInMS
        );

        await client.query("COMMIT");

        return {
            accessToken,
            csrfToken,
            message: "Refresh-token and csrf-token generated successfully"
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const processAccountEmailVerify = async (id) => {
    try {
        const isEmailAlreadyVerified = await isEmailVerified(id);
        if (isEmailAlreadyVerified) {
            return { message: "Email already verified" };
        }

        const user = await verifyAccountEmail(id);
        if (!user) {
            throw new ApiError(500, "Unable to verify email");
        }

        await sendPasswordSetupEmail({ userId: id, userEmail: user.email });

        return { message: "Email verified successfully. Please setup password using link provided in the email." };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(500, "Unable to send email");
        }
    }
}

const processPasswordSetup = async (payload) => {
    const { userId, userEmail, password } = payload;

    const result = await doesEmailExist(userId, userEmail);
    if (!result || result?.email !== userEmail) {
        throw new ApiError(404, "Bad request");
    }

    const hashedPassword = await generateHashedPassword(password);
    const affectedRow = await setupUserPassword({ userId, userEmail, password: hashedPassword });
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to setup password");
    }

    return { message: "Password setup successful. Please login now using your email and password." };
}

module.exports = {
    login,
    logout,
    getNewAccessAndCsrfToken,
    processAccountEmailVerify,
    processPasswordSetup
};
