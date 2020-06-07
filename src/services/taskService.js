const config = require('../config/index')

const Tasks = require("../models/task")
const cronService = require("../services/cronService");

exports.createTask = async (fastify,
    taskRequest) => {
    try {
        taskRequest['userId'] = 1
        taskRequest['createdBy'] = 'self'
        const tasks = new Tasks(taskRequest)
        await tasks.save()
        cronService.taskRunner(taskRequest.name, taskRequest.time)
        tasks['status'] = 200
        return tasks
    }
    catch (err) {
        return err
    }
}

exports.getTasks = async (fastify,
    taskInfo) => {
    try {
        const tasks = await Tasks.find(taskInfo)
        tasks['status'] = 200
        return tasks
    }
    catch (err) {
        return err
    }
}