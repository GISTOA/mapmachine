//=========================================GLOBAL FUNCTIONS========================================================

function accept() {
    if (document.getElementById('agree').checked) {
        dijit.byId("continue").setAttribute('disabled', false);
    } else {
        dijit.byId("continue").setAttribute('disabled', true);
    }
}

function accept2() {
    if (document.getElementById('agree2').checked) {
        dijit.byId("continue2").setAttribute('disabled', false);
    } else {
        dijit.byId("continue2").setAttribute('disabled', true);
    }
}

function zcontinue() {
    setCookie("zoning", "True", 0.125);
    $('#close-btn2').trigger('click');
    $("#tree3").dynatree("getTree").getNodeByKey("20").select();
}

function zreturn() {
    setCookie("zoning", "", 1);
    $('#close-btn2').trigger('click');
}

function mcontinue() {
    setCookie("main", "True", 7);
    $('#close-btn').trigger('click');
}

function userGuide() {
    window.open("doc/User Guide.pdf", "_blank");
}

function sortByID(x, y) {
    return ((x.PARCELID == y.PARCELID) ? 0 : ((x.PARCELID > y.PARCELID) ? 1 : -1));
}

function sortByKey(x, y) {
    return ((x.Printkey == y.Printkey) ? 0 : ((x.Printkey > y.Printkey) ? 1 : -1));
}

//custom DataGrid
function fillTable(items) {
    var tdTagStart = '<td>';
    var tdTagEnd = '</td>';

    items.sort(sortByKey); //sort by ID

    var limit = items.length;

    for (var i = 0; i < limit; i++) {
        var row = '<tr width=100% onclick="shownMap(this)">';
        row += '<td width=20%>' + items[i].Printkey + tdTagEnd;
        row += '<td width=29%>' + items[i].PARCELADD + tdTagEnd;
        row += '<td width=41%>' + items[i].ONAME1 + tdTagEnd;

        row += '</tr>';
        var rowCount = $('#large >tbody >tr').length;
        $("#large > tbody:first").append(row);
    }

    $("#large").trigger('update');
}

//Zoom to the parcel when the user clicks a row
function shownMap(evt) {
    map.graphics.remove(tempGraphic);
    var clickedTaxLotId = evt.cells[0].textContent;
    if (clickedTaxLotId == null) {
        clickedTaxLotId = evt.firstChild.outerText;
    }
    var rowIndex = evt.rowIndex;
    //remove highlighted row
    if (tempcells != -1) {
        $('td').removeClass("hover");
    }
    //Highlight selected row
    $(evt.cells).addClass("hover");
    tempcells = rowIndex;

    var selectedTaxLot;

    dojo.forEach(tempFeatures, function(graphic) {
        if ((graphic.attributes) && graphic.attributes.Printkey == clickedTaxLotId) {
            selectedTaxLot = graphic;
            tempGraphic = graphic;
            map.graphics.add(tempGraphic);
            return;
        }
    });
    var taxLotExtent = selectedTaxLot.geometry.getExtent();
    map.setExtent(taxLotExtent, true);
    tempstatus = 99;
}

function clearTable(table) {
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function enableSelectBoxes() {
    $('div.selectBox').each(function() {
        $(this).children('span.selected').html("Search By:");
        $(this).attr('value', $(this).children('div.selectOptions').children('span.selectOption:first').attr('value'));

        $(this).children('span.selected,span.selectArrow,span.infoTitle').click(function() {
            if ($(this).parent().children('div.selectOptions').css('display') == 'none') {
                $(this).parent().children('div.selectOptions').css('display', 'block');
            } else {
                $(this).parent().children('div.selectOptions').css('display', 'none');
            }
        });

        $(this).find('span.selectOption').click(function() {
            $(this).parent().css('display', 'none');
            $(this).closest('div.selectBox').attr('value', $(this).attr('value'));
            $(this).parent().siblings('span.selected').html($(this).html());
            var aa = $(this)[0].textContent;
            if (aa == null) {
                aa = $(this)[0].innerText;
            }
            if (aa == "Address" || aa == "SBL" || aa == "Owner Name") {
                $("#index").trigger("focus");
            }
        });
    });
    $("#mapInfo").children('span.infoTitle').html("Map Info/Help");
    $("#mapInfo").find('span.selectOption').click(function() {
        var value = $(this).attr('value');
        $(this).find('span').toggleClass("hiddenspan");
        if ($(this).find('span').css('visibility') == 'hidden') {

            $("#" + value).hide();
        } else {
            $("#" + value).show();
        }
    });
}

function getDropdownValue(selectedOption) {
    var optionValues = ["Printkey", "PARCELADD", "ONAME1"];
    var options = ["SBL", "Address", "Owner Name"]
    var dropdownValue;
    jQuery.each(options, function(i, option) {
        if (option == selectedOption) {
            dropdownValue = optionValues[i];
            return;
        }
    })
    return dropdownValue;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {

    var exdate = new Date();
    if (exdays < 1) {
        exdate.setTime(exdate.getTime() + exdays * 24 * 60 * 60 * 1000);
    } else {
        exdate.setDate(exdate.getDate() + exdays);
    }
    var exdate = exdate.toUTCString();

    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate);
    document.cookie = c_name + "=" + c_value;
}
//=========================================GLOBAL VARIABLES========================================================
var treeData = [{
    title: "Base Information",
    expand: true,
    key: "100",
    children: [{
        title: "Zoning",
        key: "20"
    }, {
        title: "Parcels",
        select: true,
        key: "22"
    }, {
        title: "Buildings",
        key: "24"
    }, {
        title: "Zip Code",
        key: "25"
    }, {
        title: "School Districts",
        key: "26"
    }, {
        title: "Fire Districts",
        key: "27"
    }, {
        title: "Fire Hydrant",
        select: true,
        key: "119"
    }]
}, {
    title: "Environmental Features",
    key: "129",
    expand: true,
    children: [{
        title: "Lakes, Ponds, Creeks",
        select: true,
        key: "29"
    }, {
        title: "Drainage Ditches & Creeks",
        key: "30",
        select: true
    }, {
        title: "Contours 2ft (LiDAR Based)",
        key: "31"
    }, {
        title: "Soils",
        key: "32"
    }, {
        title: "Wetlands",
        key: "134",
        children: [{
            title: "Wetlands - State (DEC)",
            key: "34"
        }, {
            title: "Wetlands - Federal (FWS)",
            key: "35"
        }]
    }, {
        title: "FEMA FLoodplain Information",
        key: "137",
        expand: true,
        children: [{
            title: "(Existing)FEMA Floodplain",
            expand: true,
            key: "138",
            children: [{
                title: "Existing Floodway",
                key: "38"
            }, {
                title: "Existing Floodplain",
                key: "39"
            }]
        }, {
            title: "(Proposed) FEMA Floodplain",
            expand: true,
            key: "141",
            children: [{
                title: "Proposed Floodway",
                key: "41"
            }, {
                title: "Proposed Floodplain",
                key: "42"
            }]
        }]
    }]
}, {
    title: "2014 NYS Aerial Photography",
    select: true,
    key: "118"
}];
