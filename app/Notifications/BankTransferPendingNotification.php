<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BankTransferPendingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Bank Transfer Order #' . $this->order->order_number)
                    ->greeting('Hello Admin,')
                    ->line('A new order has been placed using Bank Transfer.')
                    ->line('Order Number: ' . $this->order->order_number)
                    ->line('Total Amount: OMR ' . number_format($this->order->total_amount, 2))
                    ->line('User: ' . $this->order->user->name . ' (' . $this->order->user->email . ')')
                    ->line('Please verify the transaction via WhatsApp and approve the order.')
                    ->action('View Order', route('orders.show', $this->order->order_number)); // Linking to public order view for now, assuming admin can view it
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => "PENDING PAYMENT: Order #{$this->order->order_number} via Bank Transfer.",
            'url' => route('orders.show', $this->order->order_number),
            'type' => 'info',
            'amount' => $this->order->total_amount,
        ];
    }
}
