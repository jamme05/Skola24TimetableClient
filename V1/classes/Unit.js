const axios = require('axios');
const Class = require('./Class');

const apipath = 'https://web.skola24.se/api/'
const selectionpath = 'get/timetable/selection'

class Unit{
    #cookie;
    #scope;

    /**
     * @type {Class[]}
     */
    classes = [];

    hostName;
    unitGuid;
    /**
     * @type {String}
     */
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

        this.#cookie = unitData.cookie;
        this.#scope = unitData.scope;

        this.hostName = hostName;
    }


    async loadClasses(){
        var hostName = this.hostName;

        var data = `{"hostName":"${hostName}","unitGuid":"${this.unitGuid}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`;

        var res = await axios({
            method:'post',
            url:apipath+selectionpath,
            data,
            headers:this.gHeaders(data.length)
        });
        
        //console.log(JSON.stringify(res.data.exception))
        var classes = res.data.data.classes;
        

        for(let i in classes){
            let _class = classes[i];
            _class.cookie = this.#cookie;
            _class.scope = this.#scope;
            _class.unitGuid = this.unitGuid;

            this.classes[i] = new Class(_class, this.hostName);
        }
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
            'Cookie': this.#cookie, // The cookie
            'X-Requested-With': 'XMLHttpRequest',
            'X-scope': this.#scope // The scope
        }
    }
}

module.exports = Unit;