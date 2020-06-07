const taskService = require(`../services/taskService`);
const Utils = require("../helpers/utils");
const CONSTANTS = require("../helpers/constants");

exports.createTask = async (req, res) => {
  try {
    var createResponse = await taskService.createTask(req.fastify, req.body)
    req.fastify.log.debug(createResponse)

    if (Utils.isSuccessfulHttpResponse(createResponse)) {
      Utils.sendSuccessResponse(res, 201, CONSTANTS.OBJECT_CREATED)
    } else {
      throw Utils.newHttpError(res, 400, 10101,
        CONSTANTS.OBJECT_CREATION_FAILED, createResponse)
    }
  } catch (error) {
    Utils.handleError(res, error, 500, 10102,
      CONSTANTS.OBJECT_CREATION_FAILED)
  }
}

exports.getTasks = async (req, res) => {
  try {
    const userReq = {
      "userId": req.params.userId
    }
    var getResponse = await taskService.getTasks(req.fastify,
      userReq)
    req.fastify.log.debug(getResponse)

    if (Utils.isSuccessfulHttpResponse(getResponse)) {
      Utils.sendSuccessResponse(res, 200, CONSTANTS.OBJECT_GET_SUCCESS, getResponse)
    } else {
      throw Utils.newHttpError(res, 400, 10201,
        CONSTANTS.OBJECT_GET_FAILED, getResponse)
    }
  } catch (error) {
    Utils.handleError(res, error, 500, 10202,
      CONSTANTS.OBJECT_GET_FAILED)
  }
}
