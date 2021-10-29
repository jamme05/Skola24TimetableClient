const { writeFileSync } = require("fs");
const TimeTableClient = require("./V1/classes/TimeTableClient");
//console.log('Yes');


(async function(){
    //console.log('Yes')
    const client = new TimeTableClient('falun.skola24.se', 'Lugnetgymnasiet');

    await client.Setup();

    for(unit of client.units){
        console.log(unit.unitId)
    }

    //var unit = client.getUnitByName('Västra skolan')

    console.log(unit.unitId)
    
    
    var unit = client.defaultSchool;
    unit = client.getUnitByName('Bjursåsskolan 7-9')
    await unit.loadClasses();

    //console.log(client.units)
    //console.log(client.defaultSchool)
    
    for(var _class of unit.classes){
        console.log(_class.groupName)
    }
    

    var _class = unit.getClassByName('9b');

    var timetable = await _class.loadTimetable(1600,800);

    var render = timetable.Render()
    const buffer = render.toBuffer('image/png')
    console.log()
    writeFileSync('./test.png',buffer)
    console.log('Klar')

})();

//const client = new TimeTableClient('falun.skola24.se', 'Lugnetgymnasiet');

//var _class = client.defaultSchool.getClassByName('TE21C')

