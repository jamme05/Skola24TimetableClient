const { writeFileSync } = require("fs");
const TimeTableClient = require("./V1/classes/TimeTableClient");
//console.log('Yes');


(async function(){
    console.log('Yes')
    const client = new TimeTableClient('falun.skola24.se', 'Lugnetgymnasiet');

    await client.Setup();
    var unit = await client.defaultSchool;
    await unit.loadClasses();

    //console.log(client.units)
    //console.log(client.defaultSchool)
    var _class = client.defaultSchool.getClassByName('TE21C');

    var timetable = await _class.loadTimetable(1223,669);

    var render = timetable.Render()
    const buffer = render.toBuffer('image/png')
    console.log()
    writeFileSync('./test.png',buffer)
    console.log('Klar')
})();

//const client = new TimeTableClient('falun.skola24.se', 'Lugnetgymnasiet');

//var _class = client.defaultSchool.getClassByName('TE21C')

