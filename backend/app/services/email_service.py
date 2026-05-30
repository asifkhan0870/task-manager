import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_email(
    receiver_email: str,
    subject: str,
    body: str
):

    print("=" * 50)
    print("INSIDE SEND_EMAIL FUNCTION")
    print(f"TO: {receiver_email}")
    print(f"SMTP HOST: {settings.SMTP_HOST}")
    print(f"SMTP PORT: {settings.SMTP_PORT}")
    print("=" * 50)

    try:

        message = MIMEMultipart()

        message["From"] = settings.SMTP_EMAIL

        message["To"] = receiver_email

        message["Subject"] = subject

        message.attach(
            MIMEText(
                body,
                "plain"
            )
        )

        print("Connecting SMTP...")

        server = smtplib.SMTP(
            settings.SMTP_HOST,
            int(settings.SMTP_PORT)
        )

        print("SMTP Connected")

        server.starttls()

        print("TLS Started")

        server.login(
            settings.SMTP_EMAIL,
            settings.SMTP_PASSWORD
        )

        print("SMTP Login Successful")

        server.sendmail(
            settings.SMTP_EMAIL,
            receiver_email,
            message.as_string()
        )

        print(
            f"EMAIL SENT SUCCESSFULLY TO: {receiver_email}"
        )

        server.quit()

        print("SMTP Connection Closed")

    except Exception as e:

        print(
            f"EMAIL ERROR: {str(e)}"
        )

        import traceback

        traceback.print_exc()