const axios = require("axios");
const Timetable = require("./Timetable");


const apipath = 'https://web.skola24.se/api/'
const tablerenderpath = 'render/timetable'

class Class{
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

        this.hostName = hostName;
        this.timetable;
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @returns {Timetable}
     */
    async loadTimetable(width, height){
        this.width = width;
        this.height = height;

        this.timetable = new Timetable(await axios({
            method: 'get',
            url:apipath+tablerenderpath,
            data,
            headers: gHeaders()
        }).data);

        return this.timetable;
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

module.exports = Class;