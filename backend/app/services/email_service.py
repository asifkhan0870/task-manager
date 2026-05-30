import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_email(
    receiver_email: str,
    subject: str,
    body: str
):

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

        server = smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT
        )

        server.starttls()

        server.login(
            settings.SMTP_EMAIL,
            settings.SMTP_PASSWORD
        )

        server.sendmail(
            settings.SMTP_EMAIL,
            receiver_email,
            message.as_string()
        )

        server.quit()

        print(
            f"Email sent to {receiver_email}"
        )

    except Exception as e:

        print(
            f"Email Error: {e}"
        )