/*
Gammal kod:

const axios = require('axios')

const apipath = 'https://web.skola24.se/api/'
const keypath = 'get/timetable/render/key'
const unitpath = 'services/skola24/get/timetable/viewer/units'
const tablepath = 'https://web.skola24.se/timetable/timetable-viewer/'
const selectionpath = 'get/timetable/selection'

var domain = 'falun.skola24.se'
var school = 'Lugnetgymnasiet'

var url = tablepath+`${domain}/${school}/`
axios({
    method: 'get',
    url,
    withCredentials: true
})
.then(res => {
    var data = res.data
    var nova = '{"'+data.split('nova-widget ')[1].split('             v-cloak')[0].replace(/\n/g, '').replace(/=/g, '":').replace(/             /g, ',"').replace('help-link', ',"help-link')+'}'

    jsonData = JSON.parse(nova)

    //console.log(res.headers['set-cookie'][0].split(';')[0])
    console.log(jsonData.scope)

    getUnits('falun.skola24.se',res.headers['set-cookie'][0].split(';')[0],jsonData.scope, resp => {
        var units = resp.units
        var unit;
        for(unit of units){
            if(unit.unitId == school){
                break
            }
        }
        console.log(unit)
    })

    axios({
        method: 'post',
        data: 'null',
        url: apipath+keypath,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-scope': jsonData.scope
        }
    })
    .then(res => {
        console.log('Key:\n',res.data)
    })
})

function getUnits(domain, cookie, scope, callback){
    axios({
        method:'post',
        data: `{"getTimetableViewerUnitsRequest":{"hostName":"${domain}"}}`,
        url: apipath+unitpath,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 66,
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest',
            'X-scope': scope
        }
    })
    .then(res => callback(res.data.data.getTimetableViewerUnitsResponse))
    .catch(err => {
        console.log(err.response.data)
        console.log(err)
    })
}

*/

// Ny kod:
