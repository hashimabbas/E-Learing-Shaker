<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification as BaseNotification;

/**
 * We extend the BaseNotification model for framework compatibility.
 */
class Notification extends BaseNotification
{
    // No content needed here as BaseNotification provides all the necessary fields,
    // but the file must exist for the HandleInertiaRequests file to find it
    // if it's using the full namespace to query the table.

    // We can explicitly define the table name for absolute clarity:
    protected $table = 'notifications';
}
