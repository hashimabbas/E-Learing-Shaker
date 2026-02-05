<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewPurchaseNotification extends Notification
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): array
    {
        return [
            'data' => [
                'message' => "NEW SALE! Order #{$this->order->order_number} for USD {$this->order->total_amount}.",
                'url' => route('orders.show', $this->order->order_number),
                'type' => 'sale',
            ],
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => "NEW SALE! Order #{$this->order->order_number} for USD {$this->order->total_amount}.",
            'url' => route('orders.show', $this->order->order_number),
            'type' => 'sale',
            'amount' => $this->order->total_amount,
        ];
    }
}
