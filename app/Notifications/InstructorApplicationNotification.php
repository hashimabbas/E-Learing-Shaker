<?php

namespace App\Notifications;

use App\Models\InstructorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InstructorApplicationNotification extends Notification
{
    use Queueable;

    protected $application;

    public function __construct(InstructorApplication $application)
    {
        $this->application = $application;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast']; // Database and Broadcast for quick bell alert
    }

    public function toBroadcast(object $notifiable): array
    {
        return [
            'data' => [
                'message' => "NEW APPLICATION: {$this->application->user->name} applied to be an instructor.",
                'url' => route('admin.applications.index'),
                'type' => 'application',
            ],
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => "NEW APPLICATION: {$this->application->user->name} applied to be an instructor.",
            'url' => route('admin.applications.index'),
            'type' => 'application',
        ];
    }
}
