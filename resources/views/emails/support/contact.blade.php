{{-- resources/views/emails/support/contact.blade.php --}}
<x-mail::message>
# New Support Request

A new contact form submission has been received.

<x-mail::panel>
**From:** {{ $data['email'] }} <br>
**Subject:** {{ $data['subject'] }}
</x-mail::panel>

### Message:
{{ $data['message'] }}

---

Please respond to the user using the email address provided above.

Thanks,<br>
{{ config('app.name') }} System
</x-mail::message>
