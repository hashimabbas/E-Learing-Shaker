<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSupportMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $formData;

    /**
     * Create a new message instance.
     */
    public function __construct(array $formData)
    {
        $this->formData = $formData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'NEW SUPPORT REQUEST: ' . $this->formData['subject'],
            replyTo: $this->formData['email'], // Set reply-to to the user's email
        );
    }

    /**
     * Get the message content.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.support.contact',
            with: ['data' => $this->formData],
        );
    }
}
