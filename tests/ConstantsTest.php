<?php

namespace Tests;

use Nails\Asset\Constants;
use PHPUnit\Framework\TestCase;

class ConstantsTest extends TestCase
{
    public function testModuleSlug(): void
    {
        $this->assertSame('nails/module-asset', Constants::MODULE_SLUG);
    }
}
