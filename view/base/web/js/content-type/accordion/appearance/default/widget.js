define([
    'jquery',
    'accordion',
], function($) {
    'use strict';

    return function(config, element) {
        const $element = $(element);
        $element.children('li').each((index, element) => {
            $(element).find('[data-collapsible]').attr('data-role', 'collapsible');
            $(element).find('[data-content]').attr('data-role', 'content');
        });
        $element.accordion({
            collapsible: true,
            active: [],
            multipleCollapsible: true,
            animate: {'duration': 300},
        });
    };
});
