class Tooltipper
{
    static popperInstance = null;
    static element = null;

    static showTooltip($element, $tooltip, position)
    {
        $tooltip.show();

        Tooltipper.popperInstance = Popper.createPopper($element.get(0), $tooltip.get(0), {
            placement: position,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        });
    }

    static hideTooltip($tooltip)
    {
        $tooltip.hide();

        Tooltipper.destroyPopper();
    }

    static make($element, $tooltip, position = 'bottom')
    {
        Tooltipper.element = $element;

        $element.on('mouseenter', () => Tooltipper.showTooltip($element, $tooltip, position));
        $element.on('mouseleave', () => Tooltipper.hideTooltip($tooltip));
    }

    static remove()
    {
        if (Tooltipper.element) {
            Tooltipper.element.off('mouseenter');
            Tooltipper.element.off('mouseleave');
            Tooltipper.element = null;
        }

        Tooltipper.destroyPopper();
    }

    static destroyPopper()
    {
        if (Tooltipper.popperInstance) {
            Tooltipper.popperInstance.destroy();
            Tooltipper.popperInstance = null;
        }
    }
}