const axios = require("axios");
const Timetable = require("./Timetable");


const apipath = 'https://web.skola24.se/api/'
const tablerenderpath = 'render/timetable'
const keypath = 'get/timetable/render/key'

class Class{
    #cookie;
    #scope;

    timetable;
    width;
    height;

    id;
    groupGuid;
    groupName;
    absenceMessageNotDeliveredCount;
    isResponsible;
    isClass;
    isAdmin;
    isPrincipal;
    isMentor;
    isPreschoolGroup;
    teachers;
    selectableBy;
    substituteTeacherGuid;

    constructor(unitData, hostName){
        this.unitGuid = unitData.unitGuid;

        this.id = unitData.id;
        this.groupGuid = unitData.groupGuid;
        this.groupName = unitData.groupName;
        this.absenceMessageNotDeliveredCount = unitData.absenceMessageNotDeliveredCount;
        this.isResponsible = unitData.isResponsible;
        this.isClass = unitData.isClass;
        this.isAdmin = unitData.isAdmin;
        this.isPrincipal = unitData.isPrincipal;
        this.isMentor = unitData.isMentor;
        this.isPreschoolGroup = unitData.isPreschoolGroup;
        this.teachers = unitData.teachers;
        this.selectableBy = unitData.selectableBy;
        this.substituteTeacherGuid = unitData.substituteTeacherGuidM;

        this.#cookie = unitData.cookie;
        this.#scope = unitData.scope;

        this.hostName = hostName;
        this.timetable;
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {0} [scheduleDay=0] The day in the week you want to get the schedule from. 0 = whole week.
     * @returns {Timetable} - The timetable with the data
     */
    async loadTimetable(width, height, scheduleDay=0){
        this.width = width;
        this.height = height;


        var key = await this.createKey();

        var data = `{"renderKey":"${key}","host":"${this.hostName}","unitGuid":"${this.unitGuid}","startDate":null,"endDate":null,"scheduleDay":${scheduleDay},"blackAndWhite":false,"width":${width},"height":${height},"selectionType":0,"selection":"${this.groupGuid}","showHeader":false,"periodText":"","week":43,"year":2021,"privateFreeTextMode":null,"privateSelectionMode":false,"customerKey":""}`
        //data = '{"renderKey":"4euD6OQSVlawLXhmPwKw5uOtbBc1hLYMOvFjkDk9XeheqjrY3ZTgLQ3q2AJu65ArnRkZJqRuU9SjwYxENZzeGrXd6WXOaptVYH5jxLSXt63syD5IccxV5Ejqg9b30oUD","host":"falun.skola24.se","unitGuid":"NGIxNTg3Y2ItMWQ2NC1mZjFiLWExNDYtMGViOGI4ODk3MGQw","startDate":null,"endDate":null,"scheduleDay":0,"blackAndWhite":false,"width":1223,"height":669,"selectionType":0,"selection":"MDljZGY1NDMtYmZhYS1mMjBhLTllNWEtMjQ5YTM2ZmUyNDJj","showHeader":false,"periodText":"","week":43,"year":2021,"privateFreeTextMode":null,"privateSelectionMode":false,"customerKey":""}'

        //console.log(data)

        let res = await axios({
            method: 'post',
            url:apipath+tablerenderpath,
            data,
            headers:this.gHeaders(data.length)
        })

        let _data = res.data.data;

        this.timetable = new Timetable(_data, width, height);

        return this.timetable;
    }

    async createKey(){
        var res = await axios({
            method:'post',
            data:'null',
            url:apipath+keypath,
            headers:this.gHeaders(4)
        });

        return res.data.data.key;
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

module.exports = Class;