const axios = require('axios')
const Unit = require('./Unit.js')

const apipath = 'https://web.skola24.se/api/'
const keypath = 'get/timetable/render/key'
const unitpath = 'services/skola24/get/timetable/viewer/units'
const tablepath = 'https://web.skola24.se/timetable/timetable-viewer/'
const selectionpath = 'get/timetable/selection'
const post = 'post'
const get = 'get'

/**
 * - The client for making timetable requests from skola24
 */
class Client{
    /**
     * @type String
     */
    scope;
    /**
     * @type String
     */
    cookie;
    /**
     * @type String
     */
    defaultHostName;
    /**
     * @type String
     */
    defaultSchoolName;
    /**
     * @type {Unit|null}
     * - Is null if no defaultSchoolName is specified
     */
    defaultSchool;
    /**
     * @type Unit[]
     */
    units = [];

    /**
     * 
     * @param {String} defaultHostName - The default hostname if you want to make it easier for yourself.
     * @param {String} defaultSchoolName - The default school name if you want to make it easier for yourself. defaultHostName has to be specified for this to work.
     * 
     * If nothing is set to default it will set my school to default.
     */
    constructor(defaultHostName, defaultSchoolName){
        if(typeof defaultHostName in [null, undefined]){
            this.defaultHostName = 'falun.skola24.se';
        }
        (async () => {
            // Get scope and cookie
            var res = await axios({method:get,url:tablepath+`${defaultHostName||'falun.skola24.se'}/${defaultSchoolName||'Lugnetgymnasiet'}/`,withCredentials:true});

            var data = res.data
            var nova = '{"'+data.split('nova-widget ')[1].split('             v-cloak')[0].replace(/\n/g, '').replace(/=/g, '":').replace(/             /g, ',"').replace('help-link', ',"help-link')+'}'

            jsonData = JSON.parse(nova)
            this.scope = jsonData.scope;
            this.cookie = res.headers['set-cookie'][0].split(';')[0];

            var data = `{"getTimetableViewerUnitsRequest":{"hostName":"${hostName||this.defaultHostName}"}}`

            // Load units
            var unitReq = await axios({
                method:'post',
                data,
                url: apipath+unitpath,
                headers: this.gHeaders(data.length)
            })

            this.units = unitReq.data.data.getTimetableViewerUnitsResponse;


            if(defaultSchoolName){
                for(var unit in this.units){
                    if(unit.unitId == defaultSchoolName){
                        this.defaultSchool = unit;
                        break;
                    }
                }
                if(!this.defaultSchool){
                    this.defaultSchoolName = null;
                }
            }
            
        })
    }

    /**
     * 
     * @param {String} [hostName] - The hostname you want to get units from. Optional if you have a default hostname
     */
    async reloadUnits(hostName){
        var data = `{"getTimetableViewerUnitsRequest":{"hostName":"${hostName||this.defaultHostName}"}}`

        var res = axios({
            method:'post',
            data,
            url: apipath+unitpath,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Cookie': this.cookie,
                'X-Requested-With': 'XMLHttpRequest',
                'X-scope': this.scope
            }
        })
        return res.data.data.getTimetableViewerUnitsResponse
    }

    reloadUnits(hostName,callback){
        var data = `{"getTimetableViewerUnitsRequest":{"hostName":"${hostName||this.defaultHostName}"}}`

        axios({
            method:'post',
            data,
            url: apipath+unitpath,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Cookie': this.cookie,
                'X-Requested-With': 'XMLHttpRequest',
                'X-scope': this.scope
            }
        })
        .then(res => {if(typeof callback == 'function') callback(res.data.data.getTimetableViewerUnitsResponse);})
    }

    async getClasses(unitId,hostName){
        var data = `{"hostName":"${hostName||this.defaultHostName}","unitGuid":"${unitId}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`

        var res = await axios({
            method:post,
            url:apipath+selectionpath,
            data,
            headers:this.gHeaders(data.length)
        })

        return res.data.data.classes;
    }

    getClasses(unitId,hostName,callback){
        var data = `{"hostName":"${hostName||this.defaultHostName}","unitGuid":"${unitId}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`

        axios({
            method:post,
            url:apipath+selectionpath,
            data,
            headers:this.gHeaders(data.length)
        })
        .then(res => {if(typeof callback == 'function') callback(res.data.data.classes);})
    }

    /**
     * 
     * @param {Number} len - The length of your data
     * 
     * - Returns headers needed for requests
     */
    gHeaders(len){
        return {
            'Content-Type': 'application/json',
            'Content-Length': len,
            'Cookie': this.cookie, // The cookie
            'X-Requested-With': 'XMLHttpRequest',
            'X-scope': this.scope // The scope
        }
    }

    createKey(callback){
        axios({
            method:post,
            data:'null',
            url:apipath+keypath,
            headers:this.gHeaders(4)
        })
        .then(res => {if(typeof callback == 'function')callback(res.data.data.key)});
    }

    async createKey(){
        res = await axios({
            method:post,
            data:'null',
            url:apipath+keypath,
            headers:this.gHeaders(4)
        });

        return res.data.data.key;
    }

    getUnitByName(name){
        for(var unit of this.units){
            if(unit.groupName == name){
                return unit;
            }
        }
        return null;
    }
}

module.exports = Client;