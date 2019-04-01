
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
    // Piste : input.onclick = new Function('event', onclick); permet déxecuter une fonction à partir d'un string
    // Mais j'arrive pas à éxécuter de script depuis la toolbox pour l'instant
    createButtonUpload() {
        let elem = `
            <label for="upload_project" class="btn btn-outline-secondary" data-toggle="tooltip" data-tooltip="upload" style="margin-bottom: 0px">
                <i class="fa fa-folder-open"></i>
            </label>
            <input id="upload_project" type="file" hidden>
        `;

        // document.getElementById("upload_project").addEventListener('change', handleFileSelect, false);
        // Marche pas car l'object n'existe pas encore :(
        return elem;

    }

    createButtonExport(matrixNameIconAction) {
        let htmlElem = `
            <button class="btn btn-outline-secondary dropdown-toggle" id="buttonExport" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-tooltip="export">
                <i class="fas fa-file-export"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="buttonExport" >`;
        for (let i = 0; i < matrixNameIconAction.length; i++) {
            let curElem = matrixNameIconAction[i];
            htmlElem += `<a class="dropdown-item" href="#" onclick="${curElem[2]}"><i class="${curElem[1]}"></i> ${curElem[0]}</a>`;
        }
        htmlElem +=`</div>`;
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
        let buttonHtml = `<button id="${id}" type="button" class="btn ${extraClass}" onclick="${onclickAction}" data-toggle="tooltip" data-tooltip="${dataTooltip}"><i class="${icon}"></i></button>\n`;
        return buttonHtml;
    }

    addButtonLink(id, href, extraClass, icon, dataTooltip) {
        let linkHtml = `<a target="_blank" href="${href}" role="button" id="${id}" class="btn ${extraClass}" data-toggle="tooltip" data-tooltip="${dataTooltip}"><i class="${icon}"></i></a>`;
        return linkHtml;
    }

    draw() {
        let html="";

        html += `
        <nav class="nav navbar-expand-lg navbar-light bg-light">
            <ul class="nav mr-auto">
        `;

        for (let i = 0; i < this.leftObjects.length; i++) {
            html += '<li class="nav-item button">\n';
            html += this.leftObjects[i];
            html += '</li>\n';
        }

        html += `</ul>
             <ul class="nav">`;

        for (let i = 0; i < this.rightObjects.length; i++) {
            html += '<li class="nav-item button">\n';
            html += this.rightObjects[i];
            html += '</li>\n';
        }

        html += `
            </ul>
        </nav>
        `;

        this.toolBox.innerHTML = html;

    }

    addHelp() {
        this.addElementToRightBar(this.createButtonHelp("activite-aide"));
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

            this.addHelp();
            this.addElementToRightBar(this.createButtonLanguage());
        } else if (exerciceName === "decision-tree") {
            this.addElementToLeftBar(this.createButtonNew("BT.reset()"));
            this.addElementToLeftBar(this.createButtonDownload("downloadExerciceFile()"));
            this.addElementToLeftBar(this.createButtonUpload()); // TODO
            this.addElementToLeftBar(this.createButtonRun("testClassify()", "executeCode"));

            this.addHelp();
        }
    }

    drawExplanation(id, explanations) {
        //this.setToolBarForExercice(exerciceName);

        let html = "";
        html += `
        <table class="table table-hover">
            <thead>
            <tr>
                <th scope="col">Boutton</th>
                <th scope="col">Explication</th>
            </tr>
            </thead>
            <tbody>
        `;

        for (let i = 0; i < this.size; i++) {
            html += `
                <tr>
                    <th style="pointer-events: none;">${this.getElement(i)}</th>
                    <td>${explanations[i]}</td>
                </tr>
            `
        }

        html += `
            </tbody>
        </table>
        `;

        let toolbarElement = document.getElementById(id);
        toolbarElement.innerHTML = html;
    }

    get size() {
        return this.leftObjects.length + this.rightObjects.length
    }

    getElement(index) {
        if (index >= this.leftObjects.length) {
            return this.rightObjects[index-this.leftObjects.length];
        }
        return this.leftObjects[index];
    }
}