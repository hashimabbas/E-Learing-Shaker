{{-- resources/views/emails/orders/confirmation.blade.php --}}
<x-mail::message>
# Order Confirmed!

Hi {{ $order->user->name }},

Thank you for your purchase! Your order **#{{ $order->order_number }}** has been successfully processed, and you now have access to your new courses.

<x-mail::panel>
**Total Paid:** USD {{ number_format($order->total_amount, 2) }}
**Date:** {{ $order->paid_at->format('M d, Y') }}
</x-mail::panel>

### Courses Enrolled:
@foreach ($order->items as $item)
- {{ $item->name }}
@endforeach

<x-mail::button :url="url('/my-learning')">
Go to My Learning
</x-mail::button>

If you have any questions, please contact our support team.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
