'use strict';
define([
    'jquery',
    'domReady!'
], function($) {
    /**
     * Popin Class
     */
    class Popin {
        /**
         * CMS Popin constructor
         */
        constructor() {
            this.name = 'CMS Popin';
            this.selector = {
                action: '-action',
                content: '.cms-block-popin',
                close: '.close'
            }
            this.className = {
                active: 'is-active',
                base: 'cms-block-popin',
            }
        }

        /**
         *  Initialize CMS Popin
         *
         *  @param {Object} config
         */
        init(config) {
            this.selector.action = '.' + config.blockId + this.selector.action;
            this.selector.close = '.' + config.blockId + this.selector.close;
            this.selector.content = '.' + config.blockId + this.selector.content;
            this.addEvent();
        }

        /**
         * Add event function
         */
        addEvent() {
            $(this.selector.action).add(this.selector.close).on('click', () => {
                this.showPopin();
            });
        }

        /**
         * Hide popins opend
         */
        closeAllPopins() {
            $('.' + this.className.base + ':not(' + this.selector.content +')').removeClass(this.className.active);
        }

        /**
         * Add Class to show popin
         */
        showPopin() {
            this.closeAllPopins();
            $(this.selector.content).toggleClass(this.className.active)
        }
    }

    /**
     * Init Popin class
     */
    return function(config) {
        const popin = new Popin();
        popin.init(config);
    };
});
