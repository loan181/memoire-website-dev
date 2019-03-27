// Store current information for modals
let selectedNeuron = new Neuron();
let selectedWeight = new Weight();

function setSelectedNeuronInfos(neuronNumber, layer) {
    selectedNeuron.number = neuronNumber;
    selectedNeuron.layer = layer;
}

function setSelectedWeightInfos(neuronNumber1, neuronNumber2, layer) {
    let n1 = new Neuron(neuronNumber1, layer);
    let n2 = new Neuron(neuronNumber2, layer+1);
    selectedWeight.n1 = n1;
    selectedWeight.n2 = n2;
    selectedWeight.layer = layer;
}

function buttonNeuronLevelPressed(layer, neuronNumber, action) {
    setSelectedNeuronInfos(neuronNumber, layer);
    $('.currentNeuronNumber').text(selectedNeuron.number);

    if (action === "neuron") {
        refreshNeuronWindowInfo();
        $('#neuronModal').modal('toggle');
    }
    else if (action === "wOut" || action === "wIn") {
        refreshWeightOutWindowInfo(action);
        $('#outWeightModal').modal('toggle');
    }
}


function buttonWeightLevelPressed(originLayer, neuron1, neuron2) {
    setSelectedWeightInfos(neuron1, neuron2, originLayer);

    refreshWeightWindowInfo();
    $('#weightModal').modal('toggle');
}

function refreshWeightWindowInfo() {
    $('.weightN1').text(selectedWeight.n1.number);
    $('.weightN2').text(selectedWeight.n2.number);
    $('#weightLayer').text(selectedWeight.layer);
    $('#weightOrigValue').text(selectedWeight.defaultWeight);
    $('#weightValue').val(selectedWeight.weight);
}

function refreshNeuronWindowInfo() {
    $('.neuronLayerInfo').text(selectedNeuron.layer);

    let neuronValue = selectedNeuron.value;
    let valueInfoStr = "vide";
    if (neuronValue !== null) {
        valueInfoStr = neuronValue;
    }
    $('#neuronValueInfo').text(valueInfoStr);
    let informationForSpecialNeuron = $('#neuronModalInformationForSpecificLayers');
    informationForSpecialNeuron.text("");
    if (selectedNeuron.layer === 1) {
        let correspondingPixelX = Math.floor((selectedNeuron.number-1)/28);
        let correspondingPixelY = (selectedNeuron.number-1)%28;
        informationForSpecialNeuron.text(`Pixel de l'image de coordonnée : (${correspondingPixelX}, ${correspondingPixelY})`);
    }
    else if (selectedNeuron.layer === 3) {
        informationForSpecialNeuron.text(`Probabilité du chiffre ${selectedNeuron.number} : ${selectedNeuron.value*100} %`);
    }
}

function refreshWeightOutWindowInfo(inOrOut) {

    let modalDiv = $('#weightsTable');
    let tableId = "tableOutWeight";
    modalDiv.empty(); // Free up what was inside

    if (inOrOut === "wIn") {
        $('.inOrOut').text("d'entrée");
    } else if (inOrOut === "wOut") {
        $('.inOrOut').text("de sortie");
    }

    let otherNeuron;
    let currentWeight;
    let currentLayer = selectedNeuron.layer;
    if (inOrOut === "wOut") {
        otherNeuron = new Neuron(0, currentLayer+1);
        currentWeight = new Weight(selectedNeuron, otherNeuron, currentLayer);
    } else if (inOrOut === "wIn") {
        otherNeuron = new Neuron(0, currentLayer-1);
        currentWeight = new Weight(otherNeuron, selectedNeuron, currentLayer-1);
    }

    // Fill up the table
    let table = $('<table>').addClass('table table-striped table-hover');
    table.attr("id", tableId);

    let head = $('<thead>');
    let headTr= $('<tr>');
    let headNames = ["Poids n°", "Valeur actuelle", "Valeur par défaut", "Différence"];
    for (let i = 0; i < headNames.length; i++) {
        headTr.append($('<th>').html(headNames[i]));
    }
    head.append(headTr);
    table.append(head);

    let tableBody = $('<tbody>');
    for(let i=0; i < otherNeuron.layerSize; i++) {
        otherNeuron.number = i;

        let curValue = currentWeight.weight;
        let defaultValue = currentWeight.defaultWeight;
        let row = $('<tr>');

        for (let j = 0; j < headNames.length; j++) {
            let rowCol = $('<td style="cursor:pointer;">');
            if (j === 0) {
                rowCol.html(`${i+1}`)
            } else if (j === 1) {
                // We hide a span with the value because the sorting won't happen on the input directly
                // There is no need to change the span text with the inut one as the sorting does not refresh when resorting
                rowCol.addClass("weightValue");
                rowCol.html(`${curValue}`);
            } else if (j === 2) {
                rowCol.html(`${defaultValue}`);
            } else if (j === 3) {
                rowCol.html(`${defaultValue - curValue}`);
            }
            row.append(rowCol);
        }
        row.click(function () {
            otherNeuron.number = i;
            selectedWeight = currentWeight;
            refreshWeightWindowInfo();

            let weightModal = $('#weightModal');
            weightModal.modal('toggle');
            weightModal.one('hide.bs.modal', function() { // Use one to avoid bugs
                // $(row).find(".weightValue").html(selectedWeight.weight); // No need, next line to it automatically
                dataTable.cell(i, 1).data(selectedWeight.weight);
                dataTable.cell(i, 3).data(selectedWeight.defaultWeight - selectedWeight.weight);
                dataTable.draw();
            })
        });
        tableBody.append(row);
    }
    table.append(tableBody);
    modalDiv.append(table);

    let dataTable = $(`#${tableId}`).DataTable(
        {
            "language": {
                "decimal":        ".", // Important to use . else sorting does not work properly
                "emptyTable":     "Aucune entrée dans la table",//"No data available in table",
                "info":           "Montrer _START_ jusqu'à _END_ de _TOTAL_ entrés",//"Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty":      "Montrer 0 jusqu'à 0 de 0 entrés",//"Showing 0 to 0 of 0 entries",
                "infoFiltered":   "(filtré de _MAX_ entrés totales)",//"(filtered from _MAX_ total entries)",
                "infoPostFix":    "",
                "thousands":      ".",
                "lengthMenu":     "Montrer _MENU_ entrés",//"Show _MENU_ entries",
                "loadingRecords": "Chargement...",//"Loading...",
                "processing":     "Traitement...",//"Processing...",
                "search":         "Chercher :",
                "zeroRecords":    "Aucun enregistrements correspondants trouvés", //"No matching records found",
                "paginate": {
                    "first":      "Premier",
                    "last":       "Dernier",
                    "next":       "Prochain",
                    "previous":   "Précédent"
                },
                "aria": {
                    "sortAscending":  ": activer pour trier la colonne par ordre croissant",//": activate to sort column ascending",
                    "sortDescending": ": activer pour trier la colonne par ordre décroissant"
                }
            }
        }
    );
    $('.dataTables_length').addClass('bs-select');
}