export const SESSION_EXPIRED_EVENT = "pmf:session-expired";

export const installUnauthorizedSessionHandler = (client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const request = error.config;
      const headers = request?.headers;
      const authorization = headers?.get?.("Authorization")
        || headers?.Authorization
        || headers?.authorization;
      const savedToken = localStorage.getItem("token");
      const requestToken = typeof authorization === "string"
        ? authorization.replace(/^Bearer\s+/i, "").trim()
        : "";

      if (
        error.response?.status === 401 &&
        savedToken &&
        requestToken === savedToken
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");

        const { pathname, search, hash } = window.location;
        const returnTo = `${pathname}${search}${hash}`;
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, {
          detail: { returnTo },
        }));
      }

      return Promise.reject(error);
    },
  );
};
