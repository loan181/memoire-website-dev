
class ToolBox{
    constructor(idToolbox) {
        this.toolBox=document.getElementById(idToolbox);
        this.leftObjects = [];
        this.rightObjects = [];
    }

    addElement(elem) {
        this.addElementToLeftBar(elem);
    }

    addElementToLeftBar(elem) {
        this.leftObjects.push(elem);
    }

    addElementToLeftBarIdx(elem, index) {
        this.leftObjects.splice(index, 0, elem);
    }

    addElementToRightBar(elem) {
        this.rightObjects.push(elem);
    }

    addElementToRightBarIdx(elem, index) {
        this.rightObjects.splice(index, 0, elem);
    }

    createButtonNew(actionOnClick) {
        return this.addButton("buttonNew", "btn-outline-secondary", actionOnClick, "far fa-file", "new");
    }

    createButtonDownload(actionOnClick) {
        return this.addButton("buttonSave", "btn-outline-secondary", actionOnClick, "fas fa-save", "download");
    }

    // TODO : gérer l'action de par lui-même, mais là j'en ai trop marre de tenter :(
    createButtonUpload() {
        let elem = `
        <li class="nav-item button" data-toggle="tooltip" data-tooltip="upload">
            <label for="upload_project" class="btn btn-outline-secondary" style="margin-bottom: 0px">
                <i class="fa fa-folder-open"></i>
            </label>
            <input id="upload_project" type="file" hidden>
        </li>
        `;
        return elem;
    }

    createButtonExport(matrixNameIconAction) {
        let htmlElem = `<li class="nav-item dropdown" data-toggle="tooltip" data-tooltip="export">
            <button class="btn btn-outline-secondary dropdown-toggle" id="buttonExport" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-file-export"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="buttonExport" >`;
        for (let i = 0; i < matrixNameIconAction.length; i++) {
            let curElem = matrixNameIconAction[i];
            htmlElem += `<a class="dropdown-item" href="#" onclick="${curElem[2]}"><i class="${curElem[1]}"></i> ${curElem[0]}</a>`;
        }
        htmlElem +=`</div>
        </li>`;
        return htmlElem;
    }

    createButtonInformation(id, onclickAction, icon, dataTooltip) {
        return this.addButton(id, "btn-info", onclickAction, icon, dataTooltip);
    }

    createButtonRunDebug(onclickAction, dataTooltip) {
        return this.addButton("buttonDebug", "btn-warning", onclickAction, "fas fa-bug", dataTooltip)
    }

    createButtonRun(onclickAction, dataTooltip) {
        return this.addButton("buttonRun", "btn-primary", onclickAction, "fas fa-play", dataTooltip)
    }

    createButtonHelp(href) {
        return this.addButtonLink("buttonLinkHelp", href, "btn-warning", "fas fa-question-circle", "help")
    }

    createButtonLanguage() {
        let htmlElem = `
        <form class="form-inline" >
            <div class="form-group">
                <label for="languageMenu" class="control-label" style="padding-right: 4px; padding-left: 14px;"><i class="fas fa-globe"></i>  </label>
                <select class="form-control" id="languageMenu" data-toggle="tooltip" data-tooltip="langage"></select>
            </div>
        </form>
        `;
        return htmlElem;
    }

    addButton(id, extraClass, onclickAction, icon, dataTooltip) {
        let buttonHtml = '<li class="nav-item button">\n';
        buttonHtml += `<button id="${id}" type="button" class="btn ${extraClass}" onclick="${onclickAction}" data-toggle="tooltip" data-tooltip="${dataTooltip}"><i class="${icon}"></i></button>\n`;
        buttonHtml += '</li>';
        return buttonHtml;
    }

    addButtonLink(id, href, extraClass, icon, dataTooltip) {
        let linkHtml = '<li class="nav-item button">\n';
        linkHtml += `<a target="_blank" href="${href}" role="button" id="${id}" class="btn ${extraClass}" data-toggle="tooltip" data-tooltip="${dataTooltip}"><i class="${icon}"></i></a>`;
        linkHtml += '</li>';
        return linkHtml;
    }

    draw() {
        let html="";

        html += `
        <nav class="nav navbar-expand-lg navbar-light bg-light">
            <ul class="nav mr-auto">
        `;

        for (let i = 0; i < this.leftObjects.length; i++) {
            html += this.leftObjects[i];
        }

        html += `</ul>
             <ul class="nav">`;

        for (let i = 0; i < this.rightObjects.length; i++) {
            html += this.rightObjects[i];
        }

        html += `
            </ul>
        </nav>
        `;

        this.toolBox.innerHTML = html;
    }
    
    setToolBarForExercice(exerciceName) {
        if (exerciceName === "KNN") {
            this.addElementToLeftBar(this.createButtonNew("LanguageCode.discard()"));
            this.addElementToLeftBar(this.createButtonDownload("downloadProject()"));
            this.addElementToLeftBar(this.createButtonUpload());
            this.addElementToLeftBar(this.createButtonExport([
                ["SVG", "fas fa-shapes", "downloadSvg()"],
                ["PNG" , "fas fa-image", "convertSvgToPng()"]
            ]));
            this.addElementToLeftBar(this.createButtonInformation("buttonShowCode", "showCode()", "far fa-eye", "showCode"));
            this.addElementToLeftBar(this.createButtonRunDebug("runBlocklyCode()", "executeCode"));
            this.addElementToLeftBar(this.createButtonRun("runPredictionCode()", "executeCode"));

            this.addElementToRightBar(this.createButtonHelp("blockly-aide.html"));
            this.addElementToRightBar(this.createButtonLanguage());
        }
    }
}