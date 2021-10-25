class Unit{
    classes;
    hostName;

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

        (async () => {
            var data = `{"hostName":"${hostName}","unitGuid":"${this.groupGuid}","filters":{"class":true,"course":false,"group":false,"period":false,"room":false,"student":false,"subject":false,"teacher":false}}`;

            var res = await axios({
                method:post,
                url:apipath+selectionpath,
                data,
                headers:this.gHeaders(data.length)
            });

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
}

module.exports = Unit;