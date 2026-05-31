import requests

from app.core.config import settings


def send_email(
    receiver_email: str,
    subject: str,
    body: str
):

    try:

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

    except Exception as e:

        print(
            f"EMAIL ERROR: {e}"
        )