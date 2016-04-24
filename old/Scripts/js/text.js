
var firstCode = [];
function GetCountEntitySearchContorl(code) {
    var tempThis = this;
    var directParam = new DirectParam();
    //directParam.inputKeywords = [];
    //directParam.selectionParam.push(new SelectionParam("*", "*"));

    directParam.inputKeywords = tempThis.keywordArr;
    firstCode.push(code);

    var tempdata = ['entity', 'script', 'rundown', 'program', 'theme'];
    var cur = "";var others=[];
    for (var i = 0; i < tempdata.length; i++) {
        if (code == tempdata[i]) {
            cur = tempdata[i];
        } else {
            others.push(tempdata[i]);
        }
    }
    $(tempThis.selectionParams).each(function (i, item) {
        $(others).each(function (j, itemj) {
            if (item.value == itemj)
                tempThis.selectionParams.splice(i, 1);
        });
    });
    tempThis.selectionParams.push(new SelectionParam("datasetcode", code));
    




    if (code === "entity") {
        $(tempThis.selectionParams).each(function (i, item) {
            if (item.value == "script" || item.value == "rundown" || item.value == "program" || item.value == "theme")
                tempThis.selectionParams.splice(i, 1);
        });
        tempThis.selectionParams.push(new SelectionParam("datasetcode", "entity"));
    }
    else {
        tempThis.selectionParams = [];
        tempThis.selectionParams.push(new SelectionParam("datasetcode", code));
    }
    
    directParam.selectionParam = tempThis.selectionParams;

    var entitySearchRequest = new EntitySearchRequest(tempThis.targetMAM, directParam, null, tempThis.pageIndex, tempThis.size);
    SearchAction.CountEntitySearchContorl(entitySearchRequest, function (obj, args) {
        if (args.state) {
            args.dataObj.code = code;
            tempThis.CountEntitySearchContorlEvent.notify(args.dataObj);
            return;
        }
        tempThis.ErrorEvent.notify(obj);
    });
}