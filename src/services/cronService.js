var cron = require('node-cron');
const Tasks = require("../models/task")

exports.taskRunner = (name, time) => {
    cron.schedule(time, () => {
        console.log(name);
    });
}

exports.taskRunnerOnStartUp = async () => {
    const tasks = await Tasks.find()
    tasks.map(task => {
        cron.schedule(task.time, () => {
            console.log(task.name);
        });
    })
}