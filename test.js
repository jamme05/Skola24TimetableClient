const { writeFileSync } = require("fs");
const TimeTableClient = require("./V1/classes/TimeTableClient");

(async () => {
    const client = new TimeTableClient('falun.skola24.se', 'Lugnetgymnasiet');

    var _class = client.defaultSchool.getClassByName('TE21A');

    var timetable = await _class.loadTimetable(1200,600)

    var buffer = timetable.Render().toBuffer()
    writeFileSync('./test.png',buffer)
    console.log('Klar')
})