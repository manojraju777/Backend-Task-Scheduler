const HttpError = require("../models/errors/httpError");
const CONSTANTS = require("./constants");

exports.isSuccessfulHttpResponse = function (response) {
  const successHttpStatuses = [200, 201, 202]

  return (
    (response && response.status) ?
      successHttpStatuses.includes(response.status)
      : false)
}

exports.isSuccessfulEmailResponse = function (response) {
  return (response && response.accepted && response.accepted.length > 0)
}

exports.sendSuccessResponse = function (response, httpStatusCode,
  message, data = null) {
  response.code(httpStatusCode)

  let json = {
    status: CONSTANTS.SUCCESS,
  }

  if (message) {
    json["message"] = message
  }

  if (data) {
    json["data"] = data
  }

  response.send(json)
}

exports.sendErrorResponse = function (response, errorCode, errorMessage,
  errorCause = '') {
  response.send({
    status: CONSTANTS.FAILIURE, message: errorMessage,
    errorCause: errorCause, code: errorCode
  })
}

exports.handleError = function (response,
  error, httpStatusCode, errorCode, errorMessage) {
  if (error instanceof HttpError) {
    throw error;
  } else {
    response.code(httpStatusCode)

    throw new HttpError(
      CONSTANTS.FAILIURE,
      errorCode,
      errorMessage,
      error.message
    )
  }
}

exports.newHttpError = function (response,
  httpStatusCode, errorCode, errorMessage, errorResponse = "") {
  response.code(httpStatusCode)

  let errorCause = errorResponse

  if (errorResponse.data) {
    if (errorResponse.data.errors) {
      errorCause = errorResponse.data.errors
    } else if (errorResponse.data.errorCause) {
      errorCause = errorResponse.data.errorCause
    } else if (errorResponse.data.message) {
      errorCause = errorResponse.data.message
    }
  } else if (errorResponse.statusText) {
    errorCause = errorResponse.statusText
  }

  return new HttpError(
    CONSTANTS.FAILIURE,
    errorCode,
    errorMessage,
    errorCause
  )
}

exports.getValidationError = function (request, requiredFields) {
  let index
  let missingField

  for (index = 0; index < requiredFields.length; index++) {
    let fieldName = `${requiredFields[index]}`
    let value

    try {
      value = eval(fieldName)
    } catch (e) {
      /** if property set to undefined while accessing error 
            is thrown variable undefined
       */
      if (e instanceof SyntaxError) {
        value = null;
      }
    }

    if (!value) {
      missingField = fieldName;

      break; // break the loop at the first validation error
    }
  }

  return missingField;
}