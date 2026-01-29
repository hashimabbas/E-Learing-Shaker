<!DOCTYPE html>
<html>
<head>
    <title>Course Enrollment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Thanks for your purchase!</h2>
        <p>Your order <strong>#{{ $orderNumber }}</strong> has been confirmed.</p>
        
        <p>You have enrolled in: <strong>{{ $courses }}</strong>.</p>

        <div style="background-color: #fff8e1; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0;">
            <strong style="color: #d35400;">Important Notice:</strong>
            <p style="margin-top: 10px;">
                For security and verification purposes, access to the course content will be available in <strong>24 hours</strong>.
            </p>
            <p>We appreciate your patience while we finalize your enrollment.</p>
        </div>

        <p>You can view your order details here: <a href="{{ route('orders.show', $orderNumber) }}">View Order</a></p>

        <p>Best regards,<br>The Learning Team</p>
    </div>
</body>
</html>
