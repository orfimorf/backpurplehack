class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        return new ApiError(400, message)
    }

    static internal() {
        return new ApiError(500, 'Непредвиденная ошибка')
    }

    static configurationError(message) {
        return new ApiError(422, message)
    }
}

module.exports = ApiError