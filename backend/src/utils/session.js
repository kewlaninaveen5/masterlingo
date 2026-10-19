
export const getSessionIdFromCookie = (cookieHeader) => {
    if (!cookieHeader) {
        return null;
    }

    const sessionCookie = cookieHeader
        .split(";")
        .find((cookie) => cookie.trim().startsWith("sessionId="));

    if (!sessionCookie) {
        return null;
    }

    return sessionCookie.split("=")[1];
};