define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/content-type-menu/option',
    'mage/accordion',
], function($, _, ko, $t, events, PreviewCollection, createContentType, pageBuilderConfig, Option) {
    'use strict';

    /**
     * @param {Object} parent
     * @param {Object} config
     * @param {Object} stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewCollection.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewCollection.prototype);

    /** Root element */
    Preview.prototype.element = null;

    Preview.prototype.initializeAccordionWidget = _.debounce(() => {
        if (Preview.element) {
            // Remove accordion if it's initialized, try/catch to handle case when accordion is not initialized
            try {
                $(Preview.element).accordion('destroy');
            } catch (error) {
                /* empty */
            }
            $(Preview.element).accordion();
        }
    }, 10);

    /**
     * Bind events to add empty Accordion item when Accordion added and reinitialize accordion when Accordion item added
     */
    Preview.prototype.bindEvents = function() {
        PreviewCollection.prototype.bindEvents.call(this);

        events.on('accordion:dropAfter', (args) => {
            if (args.id === this.contentType.id && this.contentType.children().length === 0) {
                this.addAccordionItem();
            }
        });

        events.on('accordion-item:renderAfter', (args) => {
            if (args.contentType.parentContentType.id === this.contentType.id) {
                this.initializeAccordionWidget();
            }
        });
    };

    /**
     * Add Accordion item
     */
    Preview.prototype.addAccordionItem = function() {
        createContentType(
            pageBuilderConfig.getContentTypeConfig('accordion-item'),
            this.contentType,
            this.contentType.stageId,
            {
                accordionTitle: $t('accordionTitle ') + (this.contentType.children().length + 1),
            }
        ).then(function(container) {
            this.contentType.addChild(container);
        }.bind(this));
    };

    /**
     * Return content menu options
     *
     * @return {Object}
     */
    Preview.prototype.retrieveOptions = function() {
        const options = PreviewCollection.prototype.retrieveOptions.call(this);

        options.add = new Option({
            preview: this,
            icon: '<i class=\'icon-pagebuilder-add\'></i>',
            title: 'Add',
            action: this.addAccordionItem,
            classes: ['add-child'],
            sort: 10,
        });
        return options;
    };

    /**
     * Set root element
     * @param {Object} element
     */
    Preview.prototype.afterRender = (element) => {
        Preview.element = element;
    };

    /**
     * Check if content type is container
     *
     * @return {Boolean}
     */
    Preview.prototype.isContainer = () => {
        return true;
    };

    return Preview;
});
