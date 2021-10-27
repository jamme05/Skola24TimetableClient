const axios = require('axios');
const Class = require('./Class');

const apipath = 'https://web.skola24.se/api/'
const selectionpath = 'get/timetable/selection'

class Unit{
    classes = [];

    hostName;
    unitGuid;
    unitId;
    allowCalendarExport;
    private;
    staff;
    anonymous;


    constructor(unitData, hostName){
        this.unitGuid = unitData.unitGuid;
        this.unitId = unitData.unitId;
        this.allowCalendarExport = unitData.allowCalendarExport;
        this.private = unitData.private;
        this.staff = unitData.staff;
        this.anonymous = unitData.anonymous;

        this.hostName = hostName;

        (async () => {
            var data = `{"hostName":"${hostName}","unitGuid":"${this.unitId}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`;

            var res = await axios({
                method:post,
                url:apipath+selectionpath,
                data,
                headers:this.gHeaders(data.length)
            });

            for(let i in classes){
                this.classes = Class(classes[i])
            }

            this.classes = res.data.data.classes;
        })
    }

    async reloadClasses(hostName){
        var data = `{"hostName":"${hostName||this.defaultHostName}","unitGuid":"${unitId}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`

        var res = await axios({
            method:post,
            url:apipath+selectionpath,
            data,
            headers:this.gHeaders(data.length)
        })

        return res.data.data.classes;
    }

    reloadClasses(par1,par2){
        var callback;

        if(typeof par1 == 'function') callback = par1;
        else callback = par2;
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
     * @param {String} name - The name of the class.
     * @returns {Class|null} The class from the name, returns null if not found.
     */
    getClassByName(name){
        for(var _class of this.classes){
            if(_class.groupName == name){
                return _class;
            }
        }
        return null;
        //
    }

    gHeaders(len){
        return {
            'Content-Type': 'application/json',
            'Content-Length': len,
            'Cookie': this.cookie, // The cookie
            'X-Requested-With': 'XMLHttpRequest',
            'X-scope': this.scope // The scope
        }
    }
}

module.exports = Unit;