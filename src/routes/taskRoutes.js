const controller = require('../controllers/taskController')


const routes = [
    {
        method: 'POST',
        url: '/v1/tasks',
        handler: controller.createTask
    },
    {
        method: 'GET',
        url: '/v1/tasks/:userId',
        handler: controller.getTasks
    }
]

module.exports = routes