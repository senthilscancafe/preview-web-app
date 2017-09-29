/*global define,ga*/

define(['Augment',
    'Instance',
    'keen'
], function (augment, instance, Keen) {

    'use strict';

    var EventCollector = augment(instance, function () {
        var eventCollector = this;
        this.ka = null;
        this.keenClient = null;

        this.init = function (keenCredentials) {
            this.keenClient = new Keen({
                projectId: keenCredentials.keenProjectID,
                writeKey: keenCredentials.keenWriteKey
            });
        };


        this.recordClickEvent = function (eventCategory, eventAction, eventLabel) {
            //Google analytics
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: eventAction,
                eventLabel: eventLabel
            });

            //keenio
            // Create a data object with the properties you want to send
            var keenEvent = {
                eventCategory: eventCategory,
                eventAction: eventAction, // track dollars as cents
            };

            // Send it to the "eventCategory" collection
            this.keenClient.addEvent(eventCategory, keenEvent, function (err, res) {
                if (err) {
                    // there was an error!
                } else {
                    // see sample response below
                }
            });
        };

        this.recordPageEvent = function (title) {
            ga('send', {
                hitType: 'pageview',
                title: title,
                location: location.href,
                page: location.hash
            });
            
            //FB Pixel page tracking
            fbq('track', 'PageView',{'url':location.href});
        };

        this.recordFBPixelEvent = function (eventType, eventName, params) {
            //eventType can be Standard events or custom events

            //CompleteRegistration
            if(params){
                fbq(eventType, eventName, params);
            }else{
                fbq(eventType, eventName);
            }
            


        };

    });


    return EventCollector;
});