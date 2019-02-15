
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

    addButtonNew(actionOnClick) {
        this.addButton("buttonNew", "btn-outline-secondary", actionOnClick, "far fa-file", "new");
    }

    addButtonDownload(actionOnClick) {
        this.addButton("buttonSave", "btn-outline-secondary", actionOnClick, "fas fa-save", "download");
    }

    // TODO : gérer l'action de par lui-même, mais là j'en ai trop marre de tenter :(
    addButtonUpload() {
        this.addElement(`
        <li class="nav-item button" data-toggle="tooltip" data-tooltip="upload">
            <label for="upload_project" class="btn btn-outline-secondary" style="margin-bottom: 0px">
                <i class="fa fa-folder-open"></i>
            </label>
            <input id="upload_project" type="file" hidden>
        </li>
        `);
    }

    addExportButton(matrixNameIconAction) {
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
        this.addElement(htmlElem);
    }

    addButton(id, extraClass, onclickAction, icon, dataTooltip) {
        let buttonHtml = '<li class="nav-item button">\n';
        buttonHtml += `<button id="${id}" type="button" class="btn ${extraClass}" onclick="${onclickAction}" data-toggle="tooltip" data-tooltip="${dataTooltip}"><i class="${icon}"></i></button>\n`;
        buttonHtml += '</li>';
        this.addElement(buttonHtml);
    }

    draw() {
        let html="";

        html += `
        <nav class="nav navbar-expand-lg navbar-light bg-light">
            <ul class="nav">
        `;

        for (let i = 0; i < this.leftObjects.length; i++) {
            html += this.leftObjects[i];
        }

        html += `</ul>`;

        for (let i = 0; i < this.rightObjects.length; i++) {
            html += this.rightObjects[i];
        }

        html += `
        </nav>
        `;

        this.toolBox.innerHTML = html;
    }
}