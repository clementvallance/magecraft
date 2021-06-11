define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/wysiwyg/factory',
], function($, _, ko, $t, events, PreviewBase, config, wysiwygFactory) {
    'use strict';

    /**
     * @param {Object} parent
     * @param {Object} config
     * @param {Object} stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewBase.prototype);

    /**
     * @return {Boolean}
     */
    Preview.prototype.isWysiwygSupported = function isWysiwygSupported() {
        return config.getConfig('can_use_inline_editing_on_stage');
    };

    /**
     * @param {HTMLElement} element
     */
    Preview.prototype.initWysiwyg = function(element) {
        this.element = element;
        element.id = this.contentType.id + '-editor';
        wysiwygFactory(
            this.contentType.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.contentType.dataStore, 'accordionContent'
        ).then(function(wysiwyg) {
            Preview.wysiwyg = wysiwyg;
        });
    };

    /**
     * @param {HTMLTextAreaElement} element
     */
    Preview.prototype.initTextarea = function(element) {
        this.textarea = element;

        this.textarea.value = this.contentType.dataStore.get('accordionContent');
        this.adjustTextareaHeightBasedOnScrollHeight();

        events.on('form:' + this.contentType.id + ':saveAfter', function() {
            Preview.textarea.value = Preview.contentType.dataStore.get('accordionContent');

            Preview.adjustTextareaHeightBasedOnScrollHeight();
        });
    };

    /**
     * Save current value of textarea in data store
     */
    Preview.prototype.onTextareaKeyUp = function() {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.contentType.dataStore.update(this.textarea.value, 'accordionContent');
    };

    /**
     * Start stage interaction on textarea blur
     */
    Preview.prototype.onTextareaFocus = function() {
        $(this.textarea).closest('.pagebuilder-content-type').addClass('pagebuilder-toolbar-active');

        events.trigger('stage:interactionStart');
    };

    /**
     * Stop stage interaction on textarea blur
     */
    Preview.prototype.onTextareaBlur = function() {
        $(this.textarea).closest('.pagebuilder-content-type').removeClass('pagebuilder-toolbar-active');

        events.trigger('stage:interactionStop');
    };

    /**
     * Adjust textarea height based on scrollHeight
     */
    Preview.prototype.adjustTextareaHeightBasedOnScrollHeight = function() {
        this.textarea.style.height = '';
        const scrollHeight = this.textarea.scrollHeight;
        const minHeight = parseInt($(this.textarea).css('min-height').toString(), 10);

        if (scrollHeight === minHeight) {
            // Leave height at 'auto'
            return;
        }

        $(this.textarea).height(scrollHeight);
    };

    /**
     * Check if content type is container
     *
     * @return {Boolean}
     */
    Preview.prototype.isContainer = function() {
        return false;
    };

    return Preview;
});
