/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var LanguageCode = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
LanguageCode.LANGUAGE_NAME = {
    'ar': 'العربية',
    'be-tarask': 'Taraškievica',
    'br': 'Brezhoneg',
    'ca': 'Català',
    'cs': 'Česky',
    'da': 'Dansk',
    'de': 'Deutsch',
    'el': 'Ελληνικά',
    'en': 'English',
    'es': 'Español',
    'et': 'Eesti',
    'fa': 'فارسی',
    'fr': 'Français',
    'he': 'עברית',
    'hrx': 'Hunsrik',
    'hu': 'Magyar',
    'ia': 'Interlingua',
    'is': 'Íslenska',
    'it': 'Italiano',
    'ja': '日本語',
    'kab': 'Kabyle',
    'ko': '한국어',
    'mk': 'Македонски',
    'ms': 'Bahasa Melayu',
    'nb': 'Norsk Bokmål',
    'nl': 'Nederlands, Vlaams',
    'oc': 'Lenga d\'òc',
    'pl': 'Polski',
    'pms': 'Piemontèis',
    'pt-br': 'Português Brasileiro',
    'ro': 'Română',
    'ru': 'Русский',
    'sc': 'Sardu',
    'sk': 'Slovenčina',
    'sr': 'Српски',
    'sv': 'Svenska',
    'ta': 'தமிழ்',
    'th': 'ภาษาไทย',
    'tlh': 'tlhIngan Hol',
    'tr': 'Türkçe',
    'uk': 'Українська',
    'vi': 'Tiếng Việt',
    'zh-hans': '简体中文',
    'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
LanguageCode.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
LanguageCode.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
LanguageCode.getStringParamFromUrl = function(name, defaultValue) {
    var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
LanguageCode.getLang = function() {
    var lang = LanguageCode.getStringParamFromUrl('lang', '');
    if (LanguageCode.LANGUAGE_NAME[lang] === undefined) {
        // Default to French.
        lang = 'fr';
    }
    return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
LanguageCode.isRtl = function() {
    return LanguageCode.LANGUAGE_RTL.indexOf(LanguageCode.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
LanguageCode.loadBlocks = function(defaultXml) {
    try {
        var loadOnce = window.sessionStorage.loadOnceBlocks;
    } catch(e) {
        // Firefox sometimes throws a SecurityError when accessing sessionStorage.
        // Restarting Firefox fixes this, so it looks like a bug.
        var loadOnce = null;
    }
    if ('BlocklyStorage' in window && window.location.hash.length > 1) {
        // An href with #key trigers an AJAX call to retrieve saved blocks.
        BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else if (loadOnce) {
        // Language switching stores the blocks during the reload.
        delete window.sessionStorage.loadOnceBlocks;
        var xml = Blockly.Xml.textToDom(loadOnce);
        Blockly.Xml.domToWorkspace(xml, LanguageCode.workspace);
    } else if (defaultXml) {
        // Load the editor with default starting blocks.
        var xml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xml, LanguageCode.workspace);
    } else if ('BlocklyStorage' in window) {
        // Restore saved blocks in a separate thread so that subsequent
        // initialization is not affected from a failed load.
        window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
};

/**
 * Save the blocks and reload with a different language.
 */
LanguageCode.changeLanguage = function() {
    // Store the blocks for the duration of the reload.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (window.sessionStorage) {
        var xml = Blockly.Xml.workspaceToDom(LanguageCode.workspace);
        var text = Blockly.Xml.domToText(xml);
        window.sessionStorage.loadOnceBlocks = text;
    }

    var languageMenu = document.getElementById('languageMenu');
    var newLang = encodeURIComponent(
        languageMenu.options[languageMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
        search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
        search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
        search = search.replace(/\?/, '?lang=' + newLang + '&');
    }

    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
LanguageCode.bindClick = function(el, func) {
    if (typeof el == 'string') {
        el = document.getElementById(el);
    }
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
LanguageCode.importPrettify = function() {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
    document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
LanguageCode.getBBox_ = function(element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    return {
        height: height,
        width: width,
        x: x,
        y: y
    };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
LanguageCode.LANG = LanguageCode.getLang();

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
LanguageCode.renderContent = function() {
    var content = document.getElementById('content_' + LanguageCode.selected);
    // Initialize the pane.
    if (content.id == 'content_xml') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlDom = Blockly.Xml.workspaceToDom(LanguageCode.workspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        xmlTextarea.value = xmlText;
        xmlTextarea.focus();
    } else if (content.id == 'content_javascript') {
        LanguageCode.attemptCodeGeneration(Blockly.JavaScript, 'js');
    } else if (content.id == 'content_python') {
        LanguageCode.attemptCodeGeneration(Blockly.Python, 'py');
    } else if (content.id == 'content_php') {
        LanguageCode.attemptCodeGeneration(Blockly.PHP, 'php');
    } else if (content.id == 'content_dart') {
        LanguageCode.attemptCodeGeneration(Blockly.Dart, 'dart');
    } else if (content.id == 'content_lua') {
        LanguageCode.attemptCodeGeneration(Blockly.Lua, 'lua');
    }
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 * @param prettyPrintType {string} The file type key for the pretty printer.
 */
LanguageCode.attemptCodeGeneration = function(generator, prettyPrintType) {
    var content = document.getElementById('content_' + LanguageCode.selected);
    content.textContent = '';
    if (LanguageCode.checkAllGeneratorFunctionsDefined(generator)) {
        var code = generator.workspaceToCode(LanguageCode.workspace);

        content.textContent = code;
        if (typeof PR.prettyPrintOne == 'function') {
            code = content.textContent;
            code = PR.prettyPrintOne(code, prettyPrintType);
            content.innerHTML = code;
        }
    }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
LanguageCode.checkAllGeneratorFunctionsDefined = function(generator) {
    var blocks = LanguageCode.workspace.getAllBlocks();
    var missingBlockGenerators = [];
    for (var i = 0; i < blocks.length; i++) {
        var blockType = blocks[i].type;
        if (!generator[blockType]) {
            if (missingBlockGenerators.indexOf(blockType) === -1) {
                missingBlockGenerators.push(blockType);
            }
        }
    }

    var valid = missingBlockGenerators.length == 0;
    if (!valid) {
        var msg = 'The generator code for the following blocks not specified for '
            + generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
        Blockly.alert(msg);  // Assuming synchronous. No callback.
    }
    return valid;
};

/**
 * Initialize Blockly.  Called on page load.
 */
LanguageCode.init = function() {
    LanguageCode.initLanguage();

    var rtl = LanguageCode.isRtl();
    window.addEventListener('resize', LanguageCode.onresize, false);

    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name="%{BKY_CATLOGIC}">`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    for (var messageKey in MSG) {
        if (messageKey.indexOf('cat') == 0) {
            Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
        }
    }

    // Construct the toolbox XML, replacing translated variable names.
    var toolboxText = document.getElementById('toolbox').outerHTML;
    toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
        function(m, p1, p2) {return p1 + MSG[p2];});
    var toolboxXml = Blockly.Xml.textToDom(toolboxText);

    var blocklyDiv = document.getElementById('blocklyDiv');
    LanguageCode.workspace = Blockly.inject(blocklyDiv,
        {grid:
                {spacing: 25,
                    length: 3,
                    colour: '#ccc',
                    snap: true},
            media: '/master-thesis-website-ia-introduction/static/js/shared/Blockly/src/media/',
            oneBasedIndex: false, // Indice commence à 0 (pas à 1)
            rtl: rtl,
            toolbox: toolboxXml,
            zoom:
                {controls: true}
        });


    // Add to reserved word list: Local variables in execution environment (runJS)
    // and the infinite loop detection function.
    Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

    //Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), LanguageCode.workspace);

    if ('BlocklyStorage' in window) {
        // Hook a save function onto unload.
        BlocklyStorage.backupOnUnload(LanguageCode.workspace);
    }

    // LanguageCode.tabClick(LanguageCode.selected);
    //
    // LanguageCode.bindClick('trashButton',
    //     function() {LanguageCode.discard(); LanguageCode.renderContent();});
    // LanguageCode.bindClick('runButton', LanguageCode.runJS);
    // // Disable the link button if page isn't backed by App Engine storage.
    // var linkButton = document.getElementById('linkButton');
    // if ('BlocklyStorage' in window) {
    //   BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    //   BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    //   BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    //   BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    //   LanguageCode.bindClick(linkButton,
    //       function() {BlocklyStorage.link(LanguageCode.workspace);});
    // } else if (linkButton) {
    //   linkButton.className = 'disabled';
    // }
    //
    // for (var i = 0; i < LanguageCode.TABS_.length; i++) {
    //   var name = LanguageCode.TABS_[i];
    //   LanguageCode.bindClick('tab_' + name,
    //       function(name_) {return function() {LanguageCode.tabClick(name_);};}(name));
    // }

    Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), LanguageCode.workspace);
    Blockly.svgResize(LanguageCode.workspace);
    // Lazy-load the syntax-highlighting.
    window.setTimeout(LanguageCode.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
LanguageCode.initLanguage = function() {
    // Set the HTML's language and direction.
    var rtl = LanguageCode.isRtl();
    document.dir = rtl ? 'rtl' : 'ltr';
    document.head.parentElement.setAttribute('lang', LanguageCode.LANG);

    // Sort languages alphabetically except for fr and en.
    var languages = [];
    var mainLanguageName = new Set(["en", "fr"]);
    var mainLanguages = [];
    for (var lang in LanguageCode.LANGUAGE_NAME) {
        if (!mainLanguageName.has(lang)) {
            languages.push([LanguageCode.LANGUAGE_NAME[lang], lang]);
        }
        else {
            mainLanguages.push([LanguageCode.LANGUAGE_NAME[lang], lang]);
        }
    }
    var comp = function(a, b) {
        // Sort based on first argument ('English', 'Русский', '简体字', etc).
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
    };
    languages.sort(comp);
    mainLanguages.sort(comp);


    // Populate the language selection menu.
    var languageMenu = document.getElementById('languageMenu');
    languageMenu.options.length = 0;

    var optGroupMain = document.createElement('optgroup');
    optGroupMain.setAttribute('label', 'main');
    for (var i = 0; i < mainLanguages.length; i++) {
        var tuple = mainLanguages[i];
        var lang = tuple[tuple.length - 1];
        var option = new Option(tuple[0], lang);
        if (lang == LanguageCode.LANG) {
            option.selected = true;
        }
        optGroupMain.appendChild(option);
    }
    languageMenu.options.add(optGroupMain);

    var optGroupOther = document.createElement('optgroup');
    optGroupOther.setAttribute('label', 'other');
    for (var i = 0; i < languages.length; i++) {
        var tuple = languages[i];
        var lang = tuple[tuple.length - 1];
        var option = new Option(tuple[0], lang);
        if (lang == LanguageCode.LANG) {
            option.selected = true;
        }
        optGroupOther.appendChild(option);
    }
    languageMenu.options.add(optGroupOther);

    languageMenu.addEventListener('change', LanguageCode.changeLanguage, true);

    LanguageCode.injectLanguageInHtml = function() {

        function replaceElementsText(elementId, tag) {
            let elems = document.getElementsByClassName(elementId);
            for (let i = 0; i < elems.length; i++) {
                var elem = elems[i];
                if (tag in MSG)
                    elem.textContent = MSG[tag];
                else
                    elem.textContent = MSG_DEF[tag];
            }
        }

        function replaceElementTooltipTitle(element, tag) {
            if (tag in MSG)
                element.setAttribute("title", MSG[tag]);
            else
                element.setAttribute("title", MSG_DEF[tag]);
        }

        function replaceElementsTextAuto(tagName) {
            replaceElementsText('B_'+tagName, tagName);
        }

        function replaceElementTooltipTitleAuto(elem) {
            var tag = elem.getAttribute('data-tooltip');
            replaceElementTooltipTitle(elem, tag);
        }
        // Inject language strings
        try {
            var allToTranslate = document.querySelectorAll("[class^=B_]");
            for (let i = 0; i < allToTranslate.length; i++) {
                var jsMsgName = allToTranslate[i].className.substring(2); // 'B_' lenght is 2
                replaceElementsTextAuto(jsMsgName);
            }

            var allTooltipToTranslate = document.querySelectorAll("[data-tooltip]");
            for (let i = 0; i < allTooltipToTranslate.length; i++) {
                replaceElementTooltipTitleAuto(allTooltipToTranslate[i]);
            }

        }
        catch (e) {
            console.log(e);
        }
    };
    LanguageCode.injectLanguageInHtml();

};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
LanguageCode.runJS = function(code) {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
    var timeouts = 0;
    var checkTimeout = function() {
        if (timeouts++ > 1000000) {
            throw MSG['timeout'];
        }
    };
    // var code = Blockly.JavaScript.workspaceToCode(LanguageCode.workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        eval(code);
    } catch (e) {
        console.error(e);
        alert(MSG['badCode'].replace('%1', e));

        // Better display for undefined functions
        // ReferenceError: NomDeLaFonction is not defined
        let eStr = e.toString();
        let prefix = "ReferenceError: ";
        if (eStr.startsWith(prefix)) {
            let startingIndex = prefix.length;
            let endingIndex = eStr.indexOf(" ", startingIndex+1);
            let nameOfTheUndefindObject = eStr.slice(startingIndex, endingIndex);
            // Correct to better looking name
            nameOfTheUndefindObject = nameOfTheUndefindObject.replace(/_C3_A9/g, "é");
            nameOfTheUndefindObject = nameOfTheUndefindObject.replace(/_/g, " ");
            alert(`Il te manque probablement une fonction nécessaire pour le bon fonctionement du code.\nVérifie que tu as bien définis la fonction du nom (approximatif) de :\n${nameOfTheUndefindObject}`)
        }
    }
};

/**
 * Discard all blocks from the workspace.
 */
LanguageCode.discard = function() {
    var count = LanguageCode.workspace.getAllBlocks().length;
    if (count < 2 ||
        window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
        LanguageCode.workspace.clear();
        if (window.location.hash) {
            window.location.hash = '';
        }
    }
};

// Load the Code demo's language strings.
document.write('<script src="/master-thesis-website-ia-introduction/static/js/shared/Blockly/msg/0DEF.js"></script>\n');
document.write('<script src="/master-thesis-website-ia-introduction/static/js/shared/Blockly/msg/' + LanguageCode.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="/master-thesis-website-ia-introduction/static/js/shared/Blockly/src/js/' + LanguageCode.LANG + '.js"></script>\n');

window.addEventListener('load', LanguageCode.init);
