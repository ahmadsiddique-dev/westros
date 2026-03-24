class ErrorApi extends Error {
    constructor(statusCode, message = "Something went wrong", success = false) {
        super(message);

        this.statusCode = statusCode;
        this.success = success;
        this.data = null;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ErrorApi };