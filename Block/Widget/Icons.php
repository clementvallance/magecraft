<?php
declare(strict_types=1);

namespace emakinafr\MageCraft\Block\Widget;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;

class Icons extends Template implements BlockInterface
{
    /**
     * @var string
     */
    protected $_template = 'widget/icon.phtml';
}
