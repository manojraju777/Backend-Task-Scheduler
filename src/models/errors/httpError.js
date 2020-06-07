class HttpError extends Error {

    constructor(status, code, message, errorCause = null) {
        super(message)
        this.status = status
        this.code = code
        this.errorCause = errorCause
    }

    toJSON() {
        let json

        if (this.errorCause) {
            json = {
                "status": this.status,
                "message": this.message,
                "code": this.code,
                "errorCause": this.errorCause
            }
        } else {
            json = {
                "status": this.status,
                "message": this.message,
                "code": this.code
            }
        }

        return json
    }

    static convertFrom(jsonObject) {
        let httpError
        if (jsonObject.errorCause) {
            httpError = new HttpError(jsonObject.status, jsonObject.code,
                jsonObject.message, jsonObject.errorCause)
        } else {
            httpError = new HttpError(jsonObject.status, jsonObject.code,
                jsonObject.message)
        }

        return jsonObject
    }
}

module.exports = HttpError