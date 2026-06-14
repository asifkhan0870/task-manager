import requests

from app.core.config import settings


def send_email(
    receiver_email: str,
    subject: str,
    body: str
):

    try:

        # ==========================
        # BREVO
        # ==========================

        if settings.BREVO_API_KEY:

            response = requests.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "accept": "application/json",
                    "api-key": settings.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                json={
                    "sender": {
                        "name": "The Hashmi Group",
                        "email": "khanasif0870@gmail.com"
                    },
                    "to": [
                        {
                            "email": receiver_email
                        }
                    ],
                    "subject": subject,
                    "htmlContent": f"<pre>{body}</pre>"
                },
                timeout=15
            )

            print(
                f"BREVO STATUS: {response.status_code}"
            )

            print(
                response.text
            )

            return

        # ==========================
        # RESEND FALLBACK
        # ==========================

        if settings.RESEND_API_KEY:

            response = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "Task Manager <onboarding@resend.dev>",
                    "to": [receiver_email],
                    "subject": subject,
                    "html": f"<pre>{body}</pre>",
                },
                timeout=15
            )

            print(
                f"RESEND STATUS: {response.status_code}"
            )

            print(
                response.text
            )

            return

        print(
            "NO EMAIL PROVIDER CONFIGURED"
        )

    except Exception as e:

        print(
            f"EMAIL ERROR: {e}"
        )