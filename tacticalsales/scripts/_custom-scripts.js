var DB = {} ;// Database alias

/** 
 * Switch to cookie based implementation
 * the below code was taken from documentation at mozilla  
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
 * This gives same property to cookie as localStorage with all functionality
 * thus we just need to change the DB engine when localStorage fails
 */

Object.defineProperty(DB, "getItem", {
        value: function (sKey) {
            if (!sKey) { return ""; }
            var name = sKey + '=';
            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i ++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    return unescape(c.substring(name.length, c.length));
                }
            }

            return "";
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

Object.defineProperty(DB, "setItem", {
    value: function (sKey, sValue) {
        if(!sKey) { return; }
            document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

// Commenting out MemoryStorage we can also remove the MemoryStorage plugin
// we have implemented CookieStorage

// fall back to a memory-based implementation
//DB = new MemoryStorage('my-app'); 

//Some scripts we use still rely on a couple old jquery methods
jQuery.fn.extend({
    bind: function (types, data, fn) {
        return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
        return this.off(types, null, fn);
    },
    delegate: function (selector, types, data, fn) {
        return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
        return arguments.length === 1 ?
            this.off(selector, "**") :
            this.off(types, selector || "**", fn);
    }
});

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return (!(charCode > 31 && (charCode < 48 || charCode > 57)));
}

if (!("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function(classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function(classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function(classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function(value) {
                    return !!~self.className.split(/\s+/g).indexOf(value);
                },

                item: function(i) {
                    return self.className.split(/\s+/g)[i] || null;
                }
            };
        }
    });
}



//alert()
// var d = document.getElementById('t');
// console.log(d.classList);

//alert(d.innerHTML);

function args(elem) {
    // Return an object of element attributes
    var newAttrs = {};
    var rinlinejQuery = /^jQuery\d+$/;
    $.each(elem.attributes, function (i, attr) {
        if (attr.specified && !rinlinejQuery.test(attr.name)) {
            newAttrs[attr.name] = attr.value;
        }
    });
    return newAttrs;
}

function popPage(page_url, title) {
    minAjax({
        url: page_url,
        type: 'GET',//Request type
        method: "false", //async
        data: null,
        success: function (e) {
            // makePrettyModal(e, true);
            bootstrapModal(e, title);
        }
    });
}

function popImg(img_url, closebtn) {
    var htmlStr = "<div class='imgPop'><img src='" + img_url + "'></div>";
    makePrettyModal(htmlStr, closebtn, false);
}

function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if(msie > 0){
        return true;
    }
    return false;
}

function islteIE9(){
    if(isIE()){
        var ua      = window.navigator.userAgent;
        var msie    = ua.indexOf("MSIE ");
        var isVer   = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));

        if(isVer < 10) {
            return true;
        }
    }
    return false;
}

function newapi(endpoint, data, method, element) {
//  var api_url = 'https://newapi.tacticalmastery.com/api/v1.0' + "/" + endpoint + "/";
    var api_url = 'https://tacticalmastery.com/api/v1.0' + "/" + endpoint + "/";

    method = method || 'POST';
    //if data is an array pass as post, otherwise the string is a simple get and needs to append to the end of the uri
    if (data.constructor !== Object) {
        api_url += data;
        data = null;
    }
    //console.log (data);
    minAjax({
        url: api_url,//request URL
        type: method,//Request type
        data: data,
        method: "false", //async
        success: function (e) {
            if (element != "undefined" && typeof element === 'function')
                element(e);
        }
    });
}

// Someone has been a very bad boy here.
/*
function xuiow(data) {
    var api_url = 'https://cl.tacticalmastery.com/cl/';
//console.log('moo');
    minAjax({
        url: api_url,
        type: 'POST',
        data: data,
        success: function (data) {
            //console.log(data);
            var dH = JSON.parse(data);
            //console.log(dH);
            if (dH.rd) {
                setTimeout("location.href = '" + dH.dst + "';", 100);
            }
        }
    });
}
*/

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }

    return "";
}

function randString(x) {
    var s = "";

    while (s.length < x && x > 0) {
        var r = Math.random();
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }

    return s;
}

function getSetSet(field, value, qsfield) {

    value = value || '';
    qsfield = qsfield || field;

    var sField = value;

    if (typeof (Storage) !== "undefined") {

        sField = DB.getItem(field);
        if (sField == null)
            sField = getQueryVariable(qsfield);
        DB.setItem(field, sField);
    }

    $("input[name=" + field + "]").val(sField);
}

function getFirstLast(instring) {
    var parts = instring.split(' ');
    var fn = parts[0];
    parts.shift(); // parts is modified to remove first word
    var ln = '';
    if (parts instanceof Array) {
        ln = parts.join(' ');
    } else {
        ln = parts;
    }
    return [fn, ln];
}

function afGetGet(field, qsField, qsRequired) {
    qsField = qsField || false;
    qsRequired = qsRequired || false;

    var returnThis;
    if (!qsRequired) returnThis = DB.getItem(field);
    if (qsField) {
        qParam = getQueryVariable(qsField);
        if (qParam != '') {
            DB.setItem(field, qParam);
            returnThis = qParam;
        }
    }
    if (returnThis)
        return returnThis.replace(/[+]/g, ' ');
    return returnThis;

}

function afSetSet(field, value) {

    if (typeof (Storage) !== "undefined") {
        DB.setItem(field, value);
    }
}

function addHiddenField(theForm, key, value) {
    // Create a hidden input element, and append it to the form:
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    theForm.appendChild(input);
}

function imgPixel(img_src) {
    var image = new Image(1, 1);
    image.src = img_src;
}
function fbTrack(trackThis, theHash) {
    // fire a facebook pixel
    if (typeof fbq != 'undefined') fbq('track', trackThis, theHash);
}

function yhTrack(ev_category, ev_action, ev_label, ev_value, cv_value) {
    window.dotq = window.dotq || [];
    window.dotq.push(
        {
            'projectId': '10001234567890',
            'properties': {
                'pixelId': '654321',
                'qstrings': {
                    'et': 'custom',
                    'ec': ev_category,
                    'ea': ev_action,
                    'el': ev_label,
                    'ev': ev_value,
                    'gv': cv_value
                }
            }
        });
}

function isMobileDevice() {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
}

var submittedContactForm = false;
var prevZipCode;

function submitContactForm() {
    var data = {};
    data['Email'] = $('[name=email]').val();
    data['FirstName'] = $('[name=name]').val();
    data['MobilePhone'] = $('[name=phoneNumber]').val();

    DB.setItem('chkt_firstName', data['FirstName']);
    DB.setItem('chkt_emailAddress', data['Email']);
    DB.setItem('chkt_phoneNumber', data['MobilePhone']);

    $("div#js-div-loading-bar").show();
    newapi('add-contact', data, 'POST', function(response) {
        json = JSON.parse(response);
        console.log(json);
        if(json.success) {
            submittedContactForm = true;

            // DB.setItem('contact_id', json.contact_id);
            //In case of Mobile devices, show address modal and go to checkout page.            
            if(isMobileDevice()) {
                $("div#js-div-loading-bar").hide();
                $("#buyModal .close-modal").click();
                setTimeout(function() {
                    $(".btn-address-modal").click();    
                }, 500);
                
            } else {
                document.location = '/tacticalsales/checkout.html';
            }
        } else {
            $("div#js-div-loading-bar").hide();
            if (json.message) {
                var errHead = 'Problem with your order';
                if (json.message != 'Invalid Credit Card Number') {
                    errHead = '<span style="color:red;font-size:24px">Payment validation failed:  Processor Declined.</span>';
                    json.message = '<span style="color:red;font-size:22px">For security reasons, you must re-enter a new card number.</span><br><br>'
                        + 'Tip: you may try another card or call <a href="tel:+18558807233">(855) 880-7233</a>.';
                }
                var errBody = '<span style="color:red;font-size:24px">' + json.message + '</span>';
                makePrettyModal('<h3>' + errHead + '</h3>' + errBody, true);
            }
        }
    });
}

function submitAddressForm() {
    var addressFormFields = [
        'address1',
        'address2',
        'city',
        'state',
        'postalCode',
    ];

    $.each(addressFormFields, function(index, value) {
        uVal = $("[name=" + value + "]").val();
        DB.setItem("chkt_" + value, uVal);
    });

    document.location = '/tacticalsales/checkout.html';
}

function SubmitSubmit(this_form) {
    $("div#js-div-loading-bar").show();
    var year = $("select[name=year]").val(), month = $("select[name=month]").val();
    var d = new Date();
    var currentYear = d.getFullYear().toString().substr(2, 2), currentMonth = ("0" + (d.getMonth() + 1)).slice(-2);
    if (!((currentYear < year) || (currentYear == year) && (currentMonth <= month))) {
        $("div#js-div-loading-bar").hide();
        makePrettyModal('<h2>Problem with your order</h2><p>Invalid Expiration Date</p>', true)
        return;
    }
    var apiFields = [];
    var contactFields = ['firstName', 'lastName', 'emailAddress', 'phoneNumber', 'address1', 'address2', 'city', 'state', 'postalCode'];

    if (pageInfo.type == "orderform") {
        apiFields = [
            'firstName',
            'lastName',
            'emailAddress',
            'phoneNumber',
            'address1',
            'address2',
            'city',
            'state',
            'postalCode',
            'cardNumber',
            'cardSecurityCode',
            'cardMonth',
            'cardYear',
            'campaignId',
            'product1_id'
        ];
    }
    //console.log("sumbitted: "+$(this_form).attr('name'));
    var paramString = 'campaignId=3&product1_qty=1';
    var itemPrice = 0; //default that smells funny
    var priceTable = {
        3: 56,
        4: 97,
        6: 169,
        8: 350,
        9: 525,
        10: 700,
        5: 117,
        7: 145
    };
    
    var orderDetails = {};

    $.each(apiFields, function(index, key) {
        var uVal = undefined;
        if (key !== "product1_id") {
            uVal = $("[name=" + key + "]").val();
        } else {
            uVal = $('input[name="product1_id"]:checked', '#checkoutForm').val();            
            console.log("product1_id" , uVal);
        }
        orderDetails[key] = uVal;
    });

    orderDetails['cardMonth'] = $("[name=month]").val();
    orderDetails['cardYear'] = $("[name=year]").val();
    orderDetails['lastName'] = "NA";

    var contactInfo = {};
    contactInfo['firstName'] = orderDetails['firstName'];
    contactInfo['lastName'] = orderDetails['lastName'];
    contactInfo['emailAddress'] = orderDetails['emailAddress'];
    contactInfo['phoneNumber'] = orderDetails['phoneNumber'];
    contactInfo['address1'] = orderDetails['address1'];
    contactInfo['address2'] = orderDetails['address2'];
    contactInfo['city'] = orderDetails['city'];
    contactInfo['state'] = orderDetails['state'];
    contactInfo['postalCode'] = orderDetails['postalCode'];

    newapi("update-contact", contactInfo, 'POST', function (e) {
        console.log(e);
    });
    
    newapi('create-order', orderDetails, 'POST', function(e) {
        
        json = JSON.parse(e);

        //console.log(json);
        if(json.success) {
            $('#checkoutForm .btn-complete').removeClass('pulse');
            //  Remove DB >>>

            if (json.orderId) {
                if (typeof json.orderId != undefined) {
                    window.myOrderID = json.orderId;
                    afSetSet("orderId", myOrderID);
                }
            }
            
            document.location = '/tacticalsales/us_batteryoffer.html?orderId=' + window.myOrderID + '&pId=' + orderDetails['product1_id'];

        } else {
            $('#checkoutForm .btn-complete').removeClass('pulse');
            if (json.message) {
                var errHead = 'Problem with your order';
                if (json.message != 'Invalid Credit Card Number') {
                    errHead = '<span style="color:red;font-size:24px">Payment validation failed:  Processor Declined.</span>';
                    json.message = '<span style="color:red;font-size:22px">For security reasons, you must re-enter a new card number.</span><br><br>'
                        + 'Tip: you may try another card or call <a href="tel:+18558807233">(855) 880-7233</a>.';
                }
                var errBody = '<span style="color:red;font-size:24px">' + json.message + '</span>';
                makePrettyModal('<h3>' + errHead + '</h3>' + errBody, true);
            }
        }

        $("div#js-div-loading-bar").hide();
    });

    $(this_form).find('select').each(function () {
        if ($.inArray($(this).attr('name'), apiFields) != -1) {
            var uVal = $(this).val();
            if (uVal) {
                if (paramString != '') {
                    paramString += '&';
                }
                paramString += $(this).attr('name') + "=" + uVal;
            }
        }
    });

    if (window.myOrderID) {
        paramString += "&orderId=" + window.myOrderID;
    }

    fbTrack('Purchase', {value: itemPrice, currency: 'USD', content_name: 'TM808'});
    yhTrack('shopping', 'Purchase', 'Purchase', 'Flashlight', itemPrice);
    // ga('send', 'event', 'Purchase', 'completed_checkout', 'conversion value', itemPrice);

    $(this_form).find('input.af').each(function () {
        if ($(this).val() != "") {
            f_name = "f_" + $(this).attr('name');
            afSetSet(f_name, $(this).val());
            if (f_name == 'f_fullName') {
                nameParts = getFirstLast($(this).val());
                afSetSet('f_firstName', nameParts[0]);
                afSetSet('f_lastName', nameParts[1]);
            }
        }
    });

    return false;
}

function doUpsellYes(upsellID, productId, itemPrice) {
    //In Case of Battery Page, itemPrice means warranty year 
    //0: 3 year, 
    //1: 1 year
    $("div#js-div-loading-bar").show();
    var usParams = {};
    if (window.myOrderID) {
        usParams['orderId'] = window.myOrderID;
        usParams['productQty'] = 1;
        var nextPage = '/tacticalsales/receipt.html?orderId=' + window.myOrderID;
        switch (upsellID) {
            case 'headlamp':
                productId = productId || '31';
                // ga('send', 'event', 'Purchase', 'Upsell (Headlamp)', 'conversion value', itemPrice || 0);
                nextPage = '/tacticalsales/receipt.html?orderId=' + window.myOrderID;
                break;
            case 'battery':
                // ga('send', 'event', 'Purchase', 'Upsell (Battery)', 'conversion value', itemPrice || 0);

                var productQtyById = {
                    3: 1,
                    4: 2,
                    5: 3,
                    6: 4,
                    7: 5,
                    8: 10,
                    9: 15,
                    10: 20
                };

                var batteryIdByQty = {
                    1: [11, 42],
                    2: [35, 43],
                    3: [36, 44],
                    4: [37, 45],
                    5: [38, 46],
                    10: [39, 47],
                    15: [40, 48],
                    20: [41, 49]
                }

                var warrantyYearIdx = itemPrice;
                productId = batteryIdByQty[productQtyById[window.myProductId]][warrantyYearIdx];
                nextPage = '/tacticalsales/us_headlampoffer.html?orderId=' + window.myOrderID;
                break;
            default:
                break;
        }
        if (productId) {
            usParams['productId'] = productId;
            newapi('upsell', usParams, 'POST', function (e) {
                json = JSON.parse(e);
                if (json.success) {
                    document.location = nextPage;
                    return;
                } else {
                    if (json.message) {
                        var messageOut = '';
                        if (typeof(json.message) === "string") {
                            messageOut = json.message;
                            if (messageOut === 'This upsale was already taken.') {
                                // continue down the funnel if the upsell is done
                                document.location = nextPage;
                                return;
                            }
                        } else {
                            for (var k in json.message) {
                                if (json.message.hasOwnProperty(k)) {
                                    messageOut += k + ":" + json.message[k] + '<br>';
                                }
                            }
                        }

                        makePrettyModal('<h2>Problem with your Addon</h2><p>' + messageOut + '</p>', true)
                    }
                    document.location = nextPage;

                }
                //else {
                //    makePrettyModal('<h2>Problem with your Addon</h2><p>An unknown error occured, try again or call our customer service</p>', true)
                //}
                $("div#js-div-loading-bar").hide();
            });
            setTimeout("location.href = '"+nextPage+"';", 1500); //just in case they are on the page for over a second after clicking
            //document.location = nextPage;

        }
    } else {
        alert("There was an error finding your order, please refresh the page and try again.")
        $("div#js-div-loading-bar").hide();
    }
}
function doUpsellNo(upsellID) {
    $("div#js-div-loading-bar").show();
    var nextPage = '/tacticalsales/receipt.html?orderId=' + window.myOrderID;
    switch (upsellID) {
        case 'battery':
            nextPage = '/tacticalsales/us_headlampoffer.html?orderId=' + window.myOrderID;
            break;
        default:
    }
    document.location = nextPage;
}

function populateThanksPage(orderInfos) {

    if ($.type(orderInfos) === "array")
        orderInfos = orderInfos[0];

    $('#orderNumber').html(orderInfos['orderId']);

    newapi("get-trans", orderInfos['orderId'],'GET', function (e) {
        json = JSON.parse(e);
        if (json.success) {
            if (json.data) {
                var firstRow = json.data[0];
                if (firstRow && firstRow['merchant']) {
                    $('#ccIdentity').html('<br>' + firstRow['merchant']);
                } else {
                    $('#ccIdentity').html('<br>Tactical Mastery');
                }
            }
        }

    });

}

function makePrettyModal(content, doFooter, makeSticky) {
    doFooter = doFooter || false;
    makeSticky = makeSticky || true;
    //myClass = myClass || false;
    var modal = new tingle.modal({
        footer: doFooter,
        stickyFooter: makeSticky,
        onOpen: function () {
            //if (myClass) $('.tingle-modal-box__content').addClass(myClass);
            //console.log('modal open');
        },
        onClose: function () {
//            console.log('modal closed');
        }
    });

    // set content
    modal.setContent(content);

// add a button
    if (doFooter) {
        modal.addFooterBtn('Close', 'tingle-btn tingle-btn--primary', function () {
            // here goes some logic
            modal.close();
        });
    }

// open modal
    modal.open();

}

function bootstrapModal(content, title) {
    var modal = $('#tm-modal');

    // set content
    modal.find('.modal-body').html(content);

    if (title != null) {
        modal.find('.modal-title').text(title);
    }
    else {
        modal.find('.modal-title').text('');
    }

    // open modal
    modal.modal('show');
}

//Terms and privacy popups
function termsModal(e) {
    bModal = false;
    popPage('terms.html', 'Terms & Conditions');
}
function partnerModal(e) {
    bModal = false;
    popPage('partner.html', 'Partner');
}

function privacyModal(e) {
    bModal = false;
    popPage('privacy.html', 'Privacy Policy');
}

function pressModal(e) {
    bModal = false;
    popPage('press.html');
}

function custcareModal(e) {
    bModal = false;
    popPage('customercare.html', 'Customer Care');
}

function populateUserInfos() {
    uiz = {};

    // this is strictly for js requests so we do not need it
    //var req = new XMLHttpRequest();
    //req.open('GET', document.location, false);
    //req.send(null);
    //uiz['he'] = req.getAllResponseHeaders().toLowerCase();
    //uiz['lan'] = navigator.browserLanguage || navigator.language;
    uiz['ref'] = document.referrer||'tm.com';
    uiz['sn'] = document.domain;
    uiz['query'] = 'nope=nope';
    return uiz;
}

/* Very shady, Veverka.
function checkForBadPlayers(cloak_params) {
    uiz = populateUserInfos();
    uiz['user_id'] = cloak_params.u;
    uiz['id'] = cloak_params.i;
    xuiow(uiz);  //send our data over to be checked

}
*/

// do we still need validate to return this? todo: get rid of this
function validate() {
    return true;
}

function getFormData(formType) {



}

function placeholderSupport() {
    //console.log(islteIE9());
    if(islteIE9()){
        var isInputSupported = 'placeholder' in document.createElement('input');
        var isTextareaSupported = 'placeholder' in document.createElement('textarea');
        if (!isInputSupported || !isTextareaSupported) {
            $('[placeholder]').focus(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder') && input.data('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                var input = $(this);
                if (input.val() == '') {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                    input.data('placeholder', true);
                } else {
                    input.data('placeholder', false);
                }
            }).blur().parents('form').submit(function () {
                $(this).find('[placeholder]').each(function () {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder') && input.data('placeholder')) {
                        input.val('');
                    }
                })
            });
        }
    }
}

/**
 *
 * @param checkoutFields_req
 * @param invalidFieldsCount
 */
function checkoutButtonPulse(checkoutFields_req, invalidFieldsCount) {
    var cf_count = checkoutFields_req.length,
        icf_count = 1;
    for (var i in checkoutFields_req) {
        if ($('[name="' + checkoutFields_req[i] + '"].required').parents('.form-group').hasClass('has-success'))
            icf_count++;
    }

    if (invalidFieldsCount === 0) {
        if ($('#checkoutForm .fv-has-feedback.has-warning').length > 0) {
            $('#checkoutForm .btn-complete').removeClass('pulse');
        }
        else {
            if (cf_count == icf_count) {
                $('#checkoutForm .btn-complete').addClass('pulse');
            }
            else {
                $('#checkoutForm .btn-complete').removeClass('pulse');
            }
        }
    }
    else {
        $('#checkoutForm .btn-complete').removeClass('pulse');
    }
}

$(document).ready(function () {
    
    prevZipCode = $("#zipcode").val();
    // Set options for phoneNumber
    // declaring it on parent level because its used in 2 cases
    // 1. On checkout page and 2. on modal
    // Cross browser set and get option, including i.e. support
    $.fn.setCursor = function(start, end) {
        if(end === undefined) {
            end = start;
        }
        return this.each(function() {
            if('selectionStart' in this) {
                this.selectionStart = start;
                this.selectionEnd = end;
            } else if(this.setSelectionRange) {
                this.setSelectionRange(start, end);
            } else if(this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };
    $.fn.getCursor = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }

    var phoneNumberOptions = {
        'translation': {
            0: {pattern: /[0-9*]/}
        },
        onKeyPress: function (cep, e, field, options) {
            // Create jQuery Object for the field
            $field = $(field);
            // Get the previous value of the field before the masking is applied
            var previousFieldValue = $field.data("previousValue");

            // Get the cursor position
            var cursorPosition = $field.getCursor();

            // check if previous value and cep value are equal to 12
            // We need to do this because a user can press backspace as well.
            if(previousFieldValue && previousFieldValue.length == 12 && cep.length == 12) {

                // If old and new value are both same then revert back to old
                // value
                cep = $field.data("previousValue");
                $field.val(previousFieldValue);
                $field.setCursor(cursorPosition);

                // Compatilibity in IE.
                setTimeout(function() {
                    $field.setCursor(cursorPosition);
                });
                return false;
            }
            $field.data("previousValue",cep);
        }, 
        onChange: function (cep, e, field, options) {
            // Create jQuery Object for the field
            $field = $(field);
            // Get the previous value of the field before the masking is applied
            var previousFieldValue = $field.data("previousValue");

            // Get the cursor position
            var cursorPosition = $field.getCursor();

            // check if previous value and cep value are equal to 12
            // We need to do this because a user can press backspace as well.
            if(previousFieldValue && previousFieldValue.length == 12 && cep.length == 12) {

                // If old and new value are both same then revert back to old
                // value
                cep = $field.data("previousValue");
                $field.val(previousFieldValue);
                $field.setCursor(cursorPosition);

                // Compatilibity in IE.
                setTimeout(function() {
                    $field.setCursor(cursorPosition);
                });
                return false;
            }
            $field.data("previousValue",cep);
        }
    };

    FastClick.attach(document.body);
    placeholderSupport();
    if (pageInfo != undefined) {

        // if (pageInfo.cl) checkForBadPlayers(pageInfo.cl); stop trying to cloak!

        if (pageInfo.type == 'redir') {

            var contactFields = ['FullName', 'FirstName', 'LastName', 'Phone', 'Email'];
            var sendData = {};
            var numFlds = 0;
            $.each(contactFields, function (index, f_name) {
                var f_val = afGetGet(f_name, f_name, true);
                if (f_val) {
                    sendData[f_name] = f_val;
                    numFlds = numFlds + 1;
                    // if they sent a full name split off into first and last
                    if (f_name == 'FullName') {
                        sendData['FirstName'] = f_val.split(' ').slice(0, -1).join(' ');
                        sendData['LastName'] = f_val.split(' ').slice(-1).join(' ');
                    }
                }
            });
            sendData['browser'] = platform.name + platform.version;
            sendData['os'] = platform.os;
            if (numFlds > 1) {
                newapi("add-contact", sendData, 'POST', function (e) {
                    //console.log('made record. go back');
                    //window.history.go(-2);
                    setTimeout("location.href = '/tacticalsales/index.html';", 500);
                });
            } else {
                //console.log('no data. go back');
                //window.history.go(-2);
                setTimeout("location.href = '/tacticalsales/index.html';", 500);
            }

        } else {
            //handle back button on all pages
            history.pushState(null, null, location.href);
            window.onpopstate = function (event) {
                history.go(1);
            }

        }

        //check autopopulate
        if (pageInfo.autopopulate) {
            $('input.af').each(function () {
                f_name = "f_" + $(this).attr('name');
                $(this).val(afGetGet(f_name, $(this).attr('name')));
            });
        }
        if(pageInfo.hasproductid) {
            window.myProductId = afGetGet("pId", "pId");
        }
        if (pageInfo.hasorderid) {

            if (pageInfo.type == 'orderform') {
                window.myOrderID = null;
                // fix radio buttons in ios
                var labs = ['rlab1', 'rlab2', 'rlab3'];
                for(i=0; i<labs.length;i++) {
                    $("#"+labs[i]).bind("touchend", function (e) {
                        var rads = ['radio', 'radio2', 'radio3'];
                        for (i = 0; i < rads.length; i++) {
                            //clear all checked data
                            $('#' + rads[i])
                                .prop('checked', false)
                                .removeAttr('checked');
                        }

                        $(this).find("input[type=radio]").prop('checked', true);
                        return true;
                    });
                }
            } else {
                window.myOrderID = afGetGet("orderId", "orderId");
            }
            if (myOrderID == null) {
                var crmLead = {};
                var newParams = {};
                var okToQuery = true;
                var requiredFields = ['firstName', 'lastName'];
                var newApiFields = ['FirstName', 'LastName', 'Phone', 'Email'];
                var optionalFields = ['phoneNumber', 'emailAddress', 'affId', 's1', 's2', 's3'];
                $.each(requiredFields.concat(optionalFields), function (index, f_name) {
                    var ls_name = "f_" + f_name;
                    var f_val = afGetGet(ls_name, f_name, true);
                    if (f_val) {
                        crmLead[f_name] = f_val;
                        if (index < newApiFields.length) {
                            newParams[newApiFields[index]] = f_val;
                        }
                    } else if (requiredFields.indexOf(f_name) != -1) {
                        okToQuery = false;
                    }
                });
                newParams['browser'] = platform.name + platform.version;
                newParams['os'] = platform.os;

                if (okToQuery)
                    newapi("add-contact", newParams, 'POST', function (e) {
                        var json = JSON.parse(e);
                        if (typeof json.contact_id != 'undefined') {
                            window.AP_id = json.contact_id;
                            afSetSet("AP_id", AP_id);
                            crmLead['custom_autopilot'] = AP_id;
                            crmLead['custom1'] = AP_id;
                        }

                        newapi("create-lead", crmLead, "POST", function (e) {
                            var json = JSON.parse(e);
                            if (typeof json.orderId != 'undefined') {
                                window.myOrderID = json.orderId;
                                afSetSet("orderId", myOrderID);
                            }
                        });
                    });
                fbTrack('Lead', {content_name: 'Filled out squeeze form'});
            } else {
                //todo: just send /getlead (endpoints and have the function do the uri
                newapi('get-lead', myOrderID, 'GET', function (e) {
                    json = JSON.parse(e);
                    if (pageInfo.type == 'thankyou') {
                        if (json.success) {
                            populateThanksPage(json.data);
                        } else if (json.message) {
                            alert('Error: ' + json.message);
                        } else {
                            alert('undefined error. please try again');
                        }
                    } else {
                        if (json.message && json.message.data && json.message.data[0]) {
                            if (json.message.data[0]['orderStatus'] == 'COMPLETE') {
                                //the order is complete and they are not on the success page
                                // they can be on an upsell page up to an hour after the initial sale
                                var doThatPop = true;
                                if (pageInfo.type == 'upsell') {
                                    var gmtStr = json.message.data[0]['dateUpdated'] + ' GMT-0400';
                                    var orderDate = new Date(gmtStr);
                                    var nowDate = new Date();
                                    var minutesSince = ((nowDate - orderDate) / 1000 / 60);
                                    doThatPop = (minutesSince > 55);
                                }
                                if (doThatPop) {
                                    isBack = false;
                                    setTimeout("location.href = '/tacticalsales/receipt.html';", 1500);
                                }
                            }
                        }
                    }
                });
            }
        }

        if(pageInfo.type == 'index') {

            $(".footer-image").click(function() {
                $(".btn-buy-modal").click();
            })

            var addressFormFields = [
                'address1',
                'postalCode',
                'city'
            ];

            //Remove target=_blank from wistia video
            function removeWistiaLink() {
                $(".wistia_responsive_wrapper a[target=_blank]").removeAttr("target");    
                var frmOrder = $('#contactForm');
                $('input[name=phoneNumber]').mask('000-000-0000', phoneNumberOptions );

                if ($('input[name=phoneNumber]'))
                {
                    var phoneNumber = $('input[name=phoneNumber]').val() || [];
                    if (phoneNumber.length == 10 && phoneNumber.indexOf('-') == -1) {
                        phoneNumber = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6);
                        $('input[name=phoneNumber]').val(phoneNumber);
                        
                        frmOrder.formValidation('revalidateField', 'phoneNumber');
                    }
                }

                if ($('input[name=name]') && typeof $('input[name=name]').val() !== 'undefined' && $('input[name=name]').val())
                {
                    if (($('input[name=name]').val() || []).length != 0) {
                        frmOrder.formValidation('revalidateField', 'name');
                    }
                }

                if ($('input[name=email]') && typeof $('input[name=email]').val() !== 'undefined' && $('input[name=email]').val())
                {
                    if (($('input[name=email]').val() || []).length != 0) {
                        frmOrder.formValidation('revalidateField', 'email');
                    }
                }

                //check address form autofill
                $.each(addressFormFields, function(index, key) {
                    if ($('input[name=' + key + ']') && typeof $('input[name=' + key + ']').val() !== 'undefined' && $('input[name=' + key + ']').val())
                    {
                        if (($('input[name=' + key + ']').val() || []).length != 0) {
                            $('#addressForm').formValidation('revalidateField', key);
                            if(key == "address1") {
                                //$(".address-2").show();
                            }
                            if(key == 'postalCode') {
                                if (($('input[name=' + key + ']').val() || []) != prevZipCode) {
                                    prevZipCode = $('input[name=' + key + ']').val();
                                    loadStateFromZip();
                                }
                            }
                        }
                    }
                });

                setTimeout(function() { removeWistiaLink(); }, 250);
            }

            setTimeout(function() { removeWistiaLink(); }, 250);
            //Track the URL change
            $(function(){
                $(window).hashchange( function(){
                    // Alerts every time the hash changes!
                    if(location.hash == '#showcontactmodal') {
                        $(".cta-buttons a").click();
                        location.hash = "";
                    }
                })
                // Trigger the event (useful on page load).
                $(window).hashchange();
            });

            /**
             * The mask pattern was previously [0-9*-]thus allowing "-" in the place of digits. 
             * this has been changed to [0-9*] thus only allowing digits. this is for the modal box masking
             */
            $('input[name=phoneNumber]').mask('000-000-0000', phoneNumberOptions );
            $('input[name=postalCode]').mask('00000', {'translation': {0: {pattern: /[0-9]/}}});

            $('input[type=tel]').on('keydown', function (e) {
                e = (e) ? e : window.event;
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode === 189)  {
                    return false;
                }
                return true;
            });

            $('#contactForm')
                .on('init.field.fv', function(e, data) {
                    var field = data.field, // Get the field name
                        $field = data.element, // Get the field element
                        bv = data.fv; // FormValidation instance

                    // Create a span element to show valid message
                    // and place it right before the field
                    var $span = $('<small/>')
                        .addClass('help-block validMessage text-success')
                        .attr('data-field', field)
                        .insertAfter($field)
                        .hide();

                    // Retrieve the valid message via getOptions()
                    var message = bv.getOptions(field).validMessage;
                    if (message) {
                        $span.html(message);
                    }
                })
                .formValidation({
                    framework: 'bootstrap4',
                    icon: {
                        valid: 'ss-check',
                        invalid: 'ss-delete',
                        validating: 'ss-refresh'
                    },
                    autoFocus: true,
                    fields: {
                        // Name field
                        name: {
                            validMessage: 'Nice to meet you!', 
                            validators: {
                                notEmpty: {
                                    message: 'Please enter your name.'
                                },
                                stringLength: {
                                    max: 100,
                                    message: 'The name must be more than 1 and less than 50 characters long.'
                                },
                                // regexp: {
                                //     regexp: /^[a-zA-Z' \.]+$/,
                                //     message: 'The name can only consist of alphabetical'
                                // }
                            }
                        },
                        // Email field
                        email: {
                            validMessage: 'Great! We will send you a confirmation e-mail with tracking # after purchasing.',
                            validators: {
                                notEmpty: {
                                    message: 'The email address is required.'
                                },
                                stringLength: {
                                    min: 1,
                                    max: 100,
                                    message: 'The email address must be more than 6 and less than 30 characters long.'
                                },
                                emailAddress: {
                                    message: 'The email address is not valid.'
                                },
                                // regexp: {
                                //     regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                                //     message: 'The value is not a valid email address'
                                // }
                            }
                        },
                        // phone number field
                        phoneNumber: {
                            validMessage: 'Success! We will only call if there’s a problem shipping to your location.', 
                            validators: {
                                notEmpty: {
                                    message: 'Please supply a phone number so we can call if there are any problems shipping your flashlight.'
                                },
                                stringLength: {
                                    min: 12, // real that is "10" but that include 2 symbols "-"
                                    message: 'Not a valid 10-digit US phone number (must not include spaces or special characters).'
                                }
                            }
                        }
                    }
                })
                .on('err.field.fv', function(e, data) {})
                .on('success.validator.fv', function(e, data) {})
                .on('err.form.fv', function(e, data) {})
                .on('success.form.fv', function(e, data) {
                    submitContactForm();
                    e.preventDefault();
                })
                .on('success.field.fv', function(e, data) {
                    var field = data.field, // Get the field name
                        $field = data.element; // Get the field element

                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').show();

                }) 
                .on('err.field.fv', function(e, data) {
                    var field = data.field, // Get the field name
                        $field = data.element; // Get the field element

                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').hide();
                });

            //Address form validation in case of Mobile Device
            $("#addressForm")
                .on('init.field.fv', function (e, data) {
                    var field = data.field,        // Get the field name
                        $field = data.element,      // Get the field element
                        bv = data.fv;           // FormValidation instance

                    // Create a span element to show valid message
                    // and place it right before the field
                    var $span = $('<small/>')
                        .addClass('help-block validMessage text-success')
                        .attr('data-field', field)
                        .insertAfter($field)
                        .hide();

                    // Retrieve the valid message via getOptions()
                    var message = bv.getOptions(field).validMessage;
                    if (message) {
                        $span.html(message);
                    }
                })
                .formValidation({
                    // excluded: [':disabled', ':hidden', ':not(:visible)'],
                    //live: 'submitted',
                    framework: 'bootstrap4',
                    icon: {
                        valid: 'ss-check',
                        invalid: 'ss-delete',
                        validating: 'ss-refresh'
                    },
                    autoFocus: true,
                    fields: {
                        // address1
                        address1: {
                            validMessage: 'Success! Free shipping confirmed.',
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 100,
                                    message: 'The address must be less than 100 characters long.'
                                },
                                notEmpty: {
                                    message: 'The address is required.'
                                }
                            }
                        },
                        // address2
                        address2: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 100,
                                    message: 'The address2 must be less than 100 characters long.'
                                }
                            }
                        },
                        // state
                        state: {
                            validators: {
                                notEmpty: {
                                    message: 'The State is required.'
                                }
                            }
                        },
                        // city
                        city: {
                            validMessage: 'That was easy!',
                            validators: {
                                stringLength: {
                                    max: 50,
                                    message: 'The city must be less than 50 characters long.'
                                },
                                notEmpty: {
                                    message: 'The city is required.'
                                }
                            }
                        },
                        // postalCode
                        postalCode: {
                            validators: {
                                stringLength: {
                                    min: 5,
                                    message: 'The zip code must be 5 number long.'
                                },
                                notEmpty: {
                                    message: 'The zip code is required.'
                                },
                            }
                        },
                    }
                })
                .on('err.field.fv', function(e, data) {})
                .on('success.validator.fv', function(e, data) {})
                .on('err.form.fv', function(e, data) {})
                .on('success.form.fv', function(e, data) {
                    submitAddressForm();
                    e.preventDefault();
                })
                .on('success.field.fv', function(e, data) {
                    var field = data.field, // Get the field name
                        $field = data.element; // Get the field element

                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').show();

                }) 
                .on('err.field.fv', function(e, data) {
                    var field = data.field, // Get the field name
                        $field = data.element; // Get the field element

                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').hide();
                });
        }

        $('input[type=number]').on('keydown', function (e) {
                e = (e) ? e : window.event;
                var charCode = (e.which) ? e.which : e.keyCode;
                var availableChar = [8, 18, 33, 34, 35, 36, 37, 38, 39, 40, 46];
                if ((e.ctrlKey && (e.keyCode == 86 || e.keyCode == 67)) || (e.shiftKey && availableChar.indexOf(charCode) !== -1)) {
                    return true;
                }
                if (availableChar.indexOf(charCode) !== -1) {
                    return true;
                }
                if (charCode >= 96 && charCode <= 105 ) {
                    return true;
                }
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            });

            $('input[type=tel]').on('keydown', function (e) {
                e = (e) ? e : window.event;
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode === 189)  {
                    return false;
                }
                return true;
            });

        if (pageInfo.type == 'orderform') {

            if(!isMobileDevice()) {
                $("input#creditcard[type=number]").attr("type","text");
            }

            var checkoutFormFields = [
                'firstName',
                'emailAddress',
                'address1',
                'address2',
                'postalCode',
                'city'
            ];

            var frmOrder = $('#checkoutForm');

            function checkPhoneNumber() {
                $('input[name=phoneNumber]').mask('000-000-0000', phoneNumberOptions );

                if ($('input[name=phoneNumber]'))
                {
                    var phoneNumber = $('input[name=phoneNumber]').val() || [];
                    if (phoneNumber.length == 10 && phoneNumber.indexOf('-') == -1) {
                        phoneNumber = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6);
                        $('input[name=phoneNumber]').val(phoneNumber);
                        frmOrder.formValidation('revalidateField', 'phoneNumber');
                    }
                }

                $.each(checkoutFormFields, function(index, key) {
                    if ($('input[name=' + key + ']') && typeof $('input[name=' + key + ']').val() !== 'undefined' && $('input[name=' + key + ']').val())
                    {
                        var tmp = $('input[name=' + key + ']').val() || [];
                        if (tmp.length != 0) {
                            frmOrder.formValidation('revalidateField', key);
                            if (key == 'postalCode') {
                                if (tmp != prevZipCode) {
                                    prevZipCode = $('input[name=' + key + ']').val();
                                    loadStateFromZip();
                                }
                            }
                            if (key == "address1") {
                                $(".address-2").show();
                            }
                        }
                    }
                });

                setTimeout(function() { checkPhoneNumber(); }, 250);
            }

            setTimeout(function() { checkPhoneNumber(); }, 250);

            fbTrack('InitiateCheckout', {content_name: 'checkout1'});
            function checkout_field_validation(fields){
                for(var i in fields){
                    formCheckoutForm.formValidation('revalidateField', fields[i]);
                }
            }
            var formCheckoutForm = $('#checkoutForm');
            var ZIPRevalidateFields = ['city', 'state'];

            /**
             * Commenting out this code and letting the form validation take care of this
             * stuff
             */

            

            // Credit Card Behavior >>>
            $("input#creditcard").detectCard({supported:['american-express', 'visa', 'mastercard', 'discover']});

            $("input#creditcard").on('keyup', function() {
                if ($(this).val() === '' || $(this).val() === undefined) {
                    $(this).parents('.form-group').prev('.payment-icon').find('.cc-icon').removeClass('inactive active');
                }
            })
                .on("cardChange", function(e, card) {
                    if (card.supported) {
                        $('.payment-icon .cc-icon.cc-'+ card.type).parents('a').siblings().find('.cc-icon').removeClass('active').addClass('inactive');
                        $('.payment-icon .cc-icon.cc-'+ card.type)
                            .removeClass('inactive')
                            .addClass('active');
                    }
                    else {
                        $('.payment-icon .cc-icon').removeClass('inactive active');
                    }
                });
            //  <<< Credit Card Behavior

            // List of test credit card numbers that you want it to be passed
            // although they can be invalid one
            var TEST_CARD_NUMBERS = ['0000000000000000'];

            // We will transform those test card numbers into a valid one as below
            var VALID_CARD_NUMBER = '4444111144441111';

            var checkoutFields_req = ['firstName', 'lastName', 'emailAddress', 'phoneNumber', 'address1', 'city', 'state', 'postalCode', 'cardNumber', 'month', 'year'];

            formCheckoutForm
                .on('init.field.fv', function (e, data) {
                    var field = data.field,        // Get the field name
                        $field = data.element,      // Get the field element
                        bv = data.fv;           // FormValidation instance

                    // Create a span element to show valid message
                    // and place it right before the field
                    var $span = $('<small/>')
                        .addClass('help-block validMessage text-success')
                        .attr('data-field', field)
                        .insertAfter($field)
                        .hide();

                    // Retrieve the valid message via getOptions()
                    var message = bv.getOptions(field).validMessage;
                    if (message) {
                        $span.html(message);
                    }
                })
                .formValidation({
                // excluded: [':disabled', ':hidden', ':not(:visible)'],
                //live: 'submitted',
                framework: 'bootstrap4',
                icon: {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-remove',
                    validating: 'fa fa-refresh'
                },
                autoFocus: true,
                fields: {
                    // firstName
                    firstName: {
                        validMessage: 'Nice to meet you!',
                        validators: {
                            notEmpty: {
                                message: 'Please enter your name.'
                            },
                            stringLength: {
                                min: 1,
                                max: 30,
                                message: 'The name must be more than 1 and less than 50 characters long.'
                            },
                            // regexp: {
                            //     regexp: /^[a-zA-Z' \.]+$/,
                            //     message: 'The name can only consist of alphabetical'
                            // }
                        }
                    },
                    //Email Address
                    emailAddress: {
                        validMessage: 'Great! We will send you a confirmation e-mail with tracking # after purchasing.',
                        validators: {
                            notEmpty: {
                                message: 'The email address is required.'
                            },
                            stringLength: {
                                min: 1,
                                max: 100,
                                message: 'The email address must be more than 6 and less than 30 characters long.'
                            },
                            emailAddress: {
                                message: 'The email address is not valid.'
                            },
                            // regexp: {
                            //     regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            //     message: 'The value is not a valid email address'
                            // }
                        }
                    },
                    // phoneNumber
                    phoneNumber: {
                        validMessage: 'Success! We will only call if there’s a problem shipping to your location.', 
                        validators: {
                            notEmpty: {
                                message: 'Please supply a phone number so we can call if there are any problems shipping your flashlight.'
                            },
                            stringLength: {
                                min: 12, // real that is "10" but that include 2 symbols "-"
                                message: 'Not a valid 10-digit US phone number (must not include spaces or special characters).'
                            }
                        }
                    },
                    // address1
                    address1: {
                        validMessage: 'Success! Free shipping confirmed.',
                        validators: {
                            stringLength: {
                                min: 1,
                                max: 100,
                                message: 'The address must be less than 100 characters long.'
                            },
                            notEmpty: {
                                message: 'The address is required.'
                            }
                        }
                    },
                    // address2
                    address2: {
                        validators: {
                            stringLength: {
                                min: 1,
                                max: 100,
                                message: 'The address2 must be less than 100 characters long.'
                            }
                        }
                    },
                    // state
                    state: {
                        validators: {
                            notEmpty: {
                                message: 'The State is required.'
                            }
                        }
                    },
                    // city
                    city: {
                        validMessage: 'That was easy!',
                        validators: {
                            stringLength: {
                                max: 50,
                                message: 'The city must be less than 50 characters long.'
                            },
                            notEmpty: {
                                message: 'The city is required.'
                            }
                        }
                    },
                    // postalCode
                    postalCode: {
                        validators: {
                            stringLength: {
                                min: 5,
                                message: 'The zip code must be 5 number long.'
                            },
                            notEmpty: {
                                message: 'The zip code is required.'
                            },
                        }
                    },
                    // cardNumber
                    cardNumber: {
                        validMessage: '',
                        validators: {
                            creditCard: {
                                message: 'Enter a valid card number.',
                                transformer: function ($field, validatorName, validator) {
                                    // Get the number pr by user
                                    var value = $field.val();
                                    var count_of_chars = parseInt($field.val().length);
                                    if(count_of_chars == 17){
                                        value = value.substr(0,count_of_chars-1);
                                    }

                                    // Check if it's one of test card numbers
                                    if (value !== '' && $.inArray(value, TEST_CARD_NUMBERS) != -1) {
                                      // then turn it to be a valid one defined by VALID_CARD_NUMBER
                                      return VALID_CARD_NUMBER;
                                    } else {
                                      // Otherwise, just return the initial value
                                      return value;
                                    }
                                }
                            },
                            notEmpty: {
                                message: 'Enter the card number.'
                            },
                            stringLength: {
                              min: 15,
                              message: 'The credit card can be 15 or 16 digits.'
                            },
                        }
                    },
                    // CSC
                    cardSecurityCode: {
                        validators: {
                            notEmpty: {
                                message: 'The Security Code is required.'
                            }
                        }
                    },
                    // Month
                    month: {
                        validators: {
                            notEmpty: {
                                message: 'The Month is required.'
                            },
                            callback: {
                                message: 'Please set month more or equal current.',
                                callback: function(value, validator, $field) {
                                    var form = $field.parents('form');
                                    var currentDate = new Date();
                                    var year    = parseInt(currentDate.getYear());
                                    var yearVal = parseInt(form.find('[name=year]').val());

                                    if (yearVal === null || yearVal === undefined) {
                                        return true;
                                    }
                                    else {
                                        var selectedYear = 100 + parseInt(form.find('[name=year]').val());
                                        var currentMonth = (parseInt(value)-1 >= parseInt(currentDate.getMonth()));
                                        if (selectedYear === year) {
                                            if (currentMonth) {
                                                form.find('[name=year]').parents('.form-group').removeClass('has-warning').addClass('has-success');
                                                form.find('[name=year]').parents('.form-group').find('.fv-control-feedback').removeClass('fa-remove').addClass('fa-check');
                                                form.find('[name=year]').parents('.form-group').find('.form-control-feedback').hide();
                                            }
                                            else {
                                                form.find('[name=year]').parents('.form-group').removeClass('has-success').addClass('has-warning');
                                                form.find('[name=year]').parents('.form-group').find('.fv-control-feedback').removeClass('fa-check').addClass('fa-remove');
                                                form.find('[name=year]').parents('.form-group').find('[data-fv-validator="callback"]').show();
                                            }
                                            return currentMonth;
                                        }
                                        else {
                                            form.find('[name=year]').parents('.form-group').removeClass('has-warning').addClass('has-success');
                                            form.find('[name=year]').parents('.form-group').find('.fv-control-feedback').removeClass('fa-remove').addClass('fa-check');
                                            form.find('[name=year]').parents('.form-group').find('.form-control-feedback').hide();
                                            return true;
                                        }
                                        // checkout_field_validation(['year']);
                                    }
                                }
                            }
                        }
                    },
                    // Year
                    year: {
                        validators: {
                            notEmpty: {
                                message: 'The Year is required.'
                            },
                            callback: {
                                message: 'Please set year more or equal current.',
                                callback: function(value, validator, $field) {
                                    var form            = $field.parents('form');
                                    var currentDate     = new Date();
                                    var yearCondition   = 100+parseInt(value) >= parseInt(currentDate.getYear());

                                    checkout_field_validation(['month']);
                                    if ($('#checkoutForm').find('[name=month]').parents('.form-group').hasClass('has-warning')) {
                                        return false;
                                    }
                                    else {
                                        return yearCondition;
                                    }
                                    // if (100+parseInt(value) > parseInt(currentDate.getYear())) {
                                    // }
                                }
                            }
                        }
                    }
                }
            })
                .on('success.validator.fv', function (e, data) {

                    if (data.field === 'cardNumber' && data.validator === 'creditCard') {
                        var $icon = data.element.data('fv.icon');
                        // data.result.type can be one of
                        // AMERICAN_EXPRESS, DINERS_CLUB, DINERS_CLUB_US, DISCOVER, JCB, LASER,
                        // MAESTRO, MASTERCARD, SOLO, UNIONPAY, VISA
                        //console.log('.cc-logos ul>li img[data-value="'+data.result.type+'"]');
                        // Add/Disable active class for card type icons >>>>
                        $('.cc-logos ul>li img').removeClass('active');
                        $('.cc-logos ul>li img[data-value="' + data.result.type + '"]').addClass('active');

                    }
                })
                .on('err.field.fv', function (e, data) {
                    var field = data.field,        // Get the field name
                        $field = data.element;      // Get the field element

                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').hide();

                    var invalidFieldsCount = data.fv.getInvalidFields().length;
                    checkoutButtonPulse(checkoutFields_req, invalidFieldsCount);
                })
                .on('status.field.fv', function (e, data) {
                    data.fv.disableSubmitButtons(false);
                })
                .on('success.field.fv', function (e, data) {
                    var field = data.field,        // Get the field name
                        $field = data.element;      // Get the field element

                    if (data.fv.getSubmitButton()) {
                        data.fv.disableSubmitButtons(false);
                    }
                    // Show the valid message element
                    $field.next('.validMessage[data-field="' + field + '"]').show();

                    var invalidFieldsCount = data.fv.getInvalidFields().length;
                    checkoutButtonPulse(checkoutFields_req, invalidFieldsCount);
                })
                .on('err.form.fv', function (e) {
                })
                .on('success.form.fv', function (e) {
                    fakevar = SubmitSubmit('#checkoutForm');
                    e.preventDefault();
                });


            //  Apply mask for checkout fields  >>>
            $('input[name=cardNumber]').mask('0000000000000000', {'translation': {0: {pattern: /[0-9*]/}}});

            /**
             * The mask pattern was previously [0-9*-]thus allowing "-" in the place of digits. 
             * this has been changed to [0-9*] thus only allowing digits.
             */
            $('input[name=phoneNumber]').mask('000-000-0000', phoneNumberOptions );
            //$('input[name=phoneNumber]').mask('000-000-0000', {'translation': {0: {pattern: /[0-9*]/}}});
            $('input[name=postalCode]').mask('00000', {'translation': {0: {pattern: /[0-9]/}}});
            //  <<<  Apply mask for checkout fields
        }
        if (pageInfo.type == 'upsell') {

            $('#upsellYes').click(function (e) {
                isBack = false;
                doUpsellYes(pageInfo.upsellval, 0, 0);
            });
            $('#upsellNo').click(function (e) {
                isBack = false;
                doUpsellNo(pageInfo.upsellval, 0, 0);
            });
        }

        if (pageInfo.om == true) {
            window.om_load_jquery = false;
        }
    }

    if (pageInfo.type == "orderform") {
        var checkoutFields = [
            'firstName',
            'lastName',
            'emailAddress',
            'phoneNumber',
            'address1',
            'address2',
            'city',
            'state',
            'postalCode',
            'cardNumber',
            'month',
            'year'
        ];

        var frmOrder = $('#checkoutForm');


        $.each(checkoutFields, function(index, value) {
            uVal = DB.getItem("chkt_" + value);

            $("[name=" + value + "]").val(uVal);

            // Keep track of previous value in previousValue, for validation 
            // purpose. Currently this is used for phone number in checkout process
            $("[name=" + value + "]").data("previousValue", uVal);

            if(uVal && uVal != null && uVal != "null") {
                frmOrder.formValidation('revalidateField', value);
            }
        });
        // product_id options;
        // $("#" + DB.getItem("chkt_product1_id")).prop("checked", true);

        //Save Checkout Page details to DB engine
        // Create a common function of saving
        var saveToDB = function() {
            console.log("saving");
            orderDetails = [];

            $.each(checkoutFields, function(index, value) {
                uVal = $("[name=" + value + "]").val();
                DB.setItem("chkt_" + value, uVal);
            });
            // DB.setItem("chkt_product1_id", $("[name=product1_id]:checked").attr("id"));
        };

        // Save whenever a form is changed
        $("form").on("change", saveToDB);
        // save whenever user tries to reload
        window.onbeforeunload = saveToDB;
    }

    //Mailcheck Plugin Code here
    $(function() {
        var domains = ['hotmail.com', 'gmail.com', 'aol.com'];
        $('#email').on('blur', function() {
            $(this).mailcheck({
                domains: domains,   // optional
                suggested: function(element, suggestion) {
                    $("#email + small").show();
                    $("#email + small").html("Did you mean <a href='javascript:void(0)'>" + suggestion.full) + "</a>";
                },
                empty: function(element) {
                }
            });
        });
    });

    //If user click on the suggested email, it will replace that email with suggested one.
    $("body").on("click", "#email + small a", function() {
        $("#email").val($(this).html());
        $("#email + small").hide();
        $("#email + small").html("Great! We will send you a confirmation e-mail with tracking # after purchasing.");
        
        if(pageInfo.type == 'orderform') {
            frmOrder.formValidation('revalidateField', 'emailAddress');
        }

        if(pageInfo.type == 'index') {
            var frmModal = $("#contactForm");
            frmModal.formValidation('revalidateField', 'email');   
        }
    });

    $('#buyModal').on('shown.bs.modal', function(event) {
        window.scrollTo(0,1)
        setTimeout(function(){
            $('#name').focus();
        },1000);
        $('#name').focus()
    });

    //once submitted contact form and click on the green button again show address modal
    $('.btn-buy-modal').click(function(e) {
        if(submittedContactForm) {
            $('.btn-address-modal').click();
            e.stopPropagation();
        }
    });

    //Zipcode lookup for both index & checkout page
    $("#zipcode").on('keyup', function () {
        loadStateFromZip();
    });
    
});

function loadStateFromZip() {
    var f_zip = $("#zipcode");
    var f_zip_val = f_zip.val();
    var params = [];
    if (f_zip_val.length == 5) {
        f_zip.addClass('processed');
        //Disable state & address while it is searching in the database
        $('#state,#city').prop('disabled', true);
        $('#state + small + i,#city + small + i').show();
        if(!$('#state + small + i').hasClass('fa-spin')) {
            $('#state + small + i,#city + small + i').addClass('fa fa-spin fa-refresh');
        }

        newapi('state/' + f_zip_val, params, 'GET', function (e) {
            var json = JSON.parse(e);
            console.log(json);
            var jData = json.data;
            if (json.success) {
                if (jData.primary_city != undefined && jData.primary_city != '' && jData.primary_city != null) {
                    $('#city').val(jData.primary_city);
                }
                if (jData.state != undefined && jData.state != '' && jData.state != null) {
                    $('#state').val(jData.state);
                }
                $('input[name=address1]').focus();
            }
            else if (json.result == "ERROR") {
            }
            //remove fa spin icons and do formvalidation
            $('#state + small + i,#city + small + i')
                .hide()
                .removeClass('fa').removeClass('fa-spin').removeClass('fa-refresh');
            $('#state,#city').prop('disabled', false);


            var frm;
            if(pageInfo.type == 'index') {
                frm = $('#addressForm');
            } else {
                frm = $('#checkoutForm');
            }
            frm.formValidation('revalidateField', 'city');
            frm.formValidation('revalidateField', 'state');
        });
    }
}

// Detects safari with Applewebkit only
function isMobileSafari() {
    return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
}
/**
 * Isolate code for lazy loading of images
 * This code can be used in multiple pages to achive lazy loading
 */
 (function($) {

    $(document).ready(function() {
        $("img.lazy").lazyload({
            skip_invisible : true
        });
        $(".clearable").addClear({
            closeSymbol: "&#10006;",
            color: "#CCC",
            top: "35px",
            right: "38px",
            returnFocus: true,
            showOnLoad: true,
            onClear: function($input) {
                var formValidation = $input.closest("form").data("formValidation");
                if(formValidation) {
                    formValidation.revalidateField($input.attr("name"));
                }
            },
            paddingRight: '55px',
            lineHeight: '1',
            display: "block"
        });
    });

    // Look for ios devices and safari
    if(isMobileSafari()) {
        // Search for credit card input and change it to text field
        $("input#creditcard[type=number]").attr("type","text");
    }
})(jQuery);