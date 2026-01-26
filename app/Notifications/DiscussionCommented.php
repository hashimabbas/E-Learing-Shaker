<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DiscussionCommented extends Notification
{
    use Queueable;

    protected $comment;
    protected $discussion;

    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
        $this->discussion = $comment->discussion;
    }

    public function via(object $notifiable): array
    {
        // Send as a database notification (for the bell icon) AND as an email (for persistence)
        return ['database', 'mail', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): array
    {
        return [
            'data' => [
                'message' => "New reply on: '{$this->discussion->title}' by {$this->comment->user->name}",
                'url' => route('discussions.show', $this->discussion->id),
                'type' => 'discussion_reply',
            ],
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $senderName = $this->comment->user->name;

        return (new MailMessage)
            ->subject("New Reply on '{$this->discussion->title}'")
            ->line("{$senderName} has posted a new reply in your course discussion thread: '{$this->discussion->title}'.")
            ->action('View Discussion', route('discussions.show', $this->discussion->id))
            ->line('Log in to reply and support your student.');
    }

    public function toDatabase(object $notifiable): array
    {
        // This payload is what is sent to the bell icon in the frontend
        return [
            'message' => "New reply on: '{$this->discussion->title}' by {$this->comment->user->name}",
            'url' => route('discussions.show', $this->discussion->id),
            'type' => 'discussion_reply',
        ];
    }
}
