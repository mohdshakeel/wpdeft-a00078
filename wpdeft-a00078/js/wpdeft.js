jQuery(document).ready(function () {
jQuery('.genSlide a').click(function(e){ 
 var potentialSteps = wpdeft_findPotentialsStepsNew(form.step, form.formID);
 var nextStepID = wpdeft_getNextEnabledStep(form.formID, potentialSteps);
 if (nextStepID == -1) {
   nextStepID = 'final';
 } 
 if(nextStepID=='final'){
 	console.log(nextStepID); 
 	wpe_orderSend(form.formID, '', '', '');
 } 



});




function wpdeft_findPotentialsStepsNew(originStepID, formID) {
    var form = wpe_getForm(formID);
    var potentialSteps = new Array();
    var conditionsArray = new Array();
    var noConditionsSteps = new Array();
    var maxConditions = 0;
    jQuery.each(form.links, function () {
        var link = this;

        if (link.originID == originStepID) {
            var error = false;
            var errorOR = true;
            if (link.conditions && link.conditions != "[]") {
                link.conditionsO = JSON.parse(link.conditions);
                var errors = lfb_checkConditions(link.conditionsO, formID, originStepID);
                error = errors.error;
                errorOR = errors.errorOR;
            } else {
                noConditionsSteps.push(link.destinationID);
                errorOR = false;
            }
            if ((link.operator == 'OR' && !errorOR) || (link.operator != 'OR' && !error)) {
                link.conditionsO = JSON.parse(link.conditions);
                conditionsArray.push({
                    stepID: parseInt(link.destinationID),
                    nbConditions: link.conditionsO.length
                });
                if (link.conditionsO.length > maxConditions) {
                    maxConditions = link.conditionsO.length;
                }
                potentialSteps.push(parseInt(link.destinationID));

            }
        }
    });
    if (originStepID == 0) {
        potentialSteps.push(parseInt(jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"]  #mainPanel .genSlide[data-start="1"]').attr('data-stepid')));
    }
    if (potentialSteps.length == 0) {
        potentialSteps.push('final');
    } else if (noConditionsSteps.length > 0 && noConditionsSteps.length < potentialSteps.length) {
        jQuery.each(noConditionsSteps, function () {
            var removeItem = this;
            potentialSteps = jQuery.grep(potentialSteps, function (value) {
                return value != removeItem;
            });
        });
        if (maxConditions > 0) {
            jQuery.each(potentialSteps, function (stepID) {
                jQuery.each(conditionsArray, function (condition) {
                    if (condition.stepID == stepID && condition.nbConditions < maxConditions) {
                        potentialSteps = jQuery.grep(potentialSteps, function (value) {
                            return value != stepID;
                        });
                    }
                });
            });
        }
    }

    return potentialSteps;
}


function wpdeft_getNextEnabledStep(formID, potentialSteps) {
    var rep = -1;
    var stepID = potentialSteps[0];
    if (stepID != 'final') {
        if (!jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"]  #mainPanel .genSlide[data-stepid="' + stepID + '"]').is('.lfb_disabled') &&
                (jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel .genSlide[data-stepid="' + stepID + '"] .lfb_item:not(.lfb-hidden)').length > 0
                        || jQuery('#estimation_popup.wpe_bootstraped[data-form="' + formID + '"] #mainPanel .genSlide[data-stepid="' + stepID + '"] .lfb_distanceError').length > 0)) {
            rep = stepID;
        } else {
            lfb_lastSteps.push(parseInt(stepID));
            wpe_updatePrice(formID);
            rep = wpdeft_getNextEnabledStep(formID, wpe_findPotentialsSteps(parseInt(stepID), formID));
        }
    }

    return rep;
}
});