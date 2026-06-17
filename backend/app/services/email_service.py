import requests

from app.core.config import settings

WEBSITE_URL = "https://task-manager-entire.onrender.com/"


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

            print("=" * 50)
            print("USING BREVO")
            print("BREVO KEY EXISTS:", bool(settings.BREVO_API_KEY))
            print("RECEIVER:", receiver_email)
            print("SUBJECT:", subject)

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
                    "htmlContent": build_email_template(
                         subject,
                         body
                       )
                },
                timeout=15
            )

            print("BREVO STATUS:", response.status_code)
            print("BREVO RESPONSE:", response.text)
            print("=" * 50)

            return response.status_code

        # ==========================
        # RESEND FALLBACK
        # ==========================

        if settings.RESEND_API_KEY:

            print("=" * 50)
            print("USING RESEND")
            print("RECEIVER:", receiver_email)

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
                    "html": build_email_template(
                           subject,
                           body
                      ),
                },
                timeout=15
            )

            print("RESEND STATUS:", response.status_code)
            print("RESEND RESPONSE:", response.text)
            print("=" * 50)

            return response.status_code

        print("NO EMAIL PROVIDER CONFIGURED")

    except Exception as e:

        print("EMAIL ERROR:", str(e))


def build_email_template(subject: str, body: str):

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>

    <body style="
        margin:0;
        padding:0;
        background:#f3f6fb;
        font-family:Arial,sans-serif;
    ">

        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">

                    <table
                        width="700"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background:white;
                            margin:30px auto;
                            border-radius:12px;
                            overflow:hidden;
                            box-shadow:0 2px 10px rgba(0,0,0,.08);
                        "
                    >

                        <!-- Header -->

                        <tr>
                            <td
                                style="
                                    background:#2563eb;
                                    padding:24px;
                                    text-align:center;
                                "
                            >
                                <h1
                                    style="
                                        color:white;
                                        margin:0;
                                    "
                                >
                                    Task Manager
                                </h1>
                            </td>
                        </tr>

                        <!-- Content -->

                        <tr>
                            <td style="padding:30px;">

                                <h2
                                    style="
                                        color:#0f172a;
                                        margin-top:0;
                                    "
                                >
                                    {subject}
                                </h2>

                                <div
                                    style="
                                        color:#334155;
                                        line-height:1.7;
                                        white-space:pre-wrap;
                                    "
                                >
                                    {body}
                                </div>

                                <br>

                                <a
                                    href="{WEBSITE_URL}"
                                    style="
                                        background:#2563eb;
                                        color:white;
                                        text-decoration:none;
                                        padding:14px 28px;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-weight:bold;
                                    "
                                >
                                    Open Task Manager
                                </a>

                                <br><br>

                                <p style="color:#64748b;">
                                    Website:
                                    <a href="{WEBSITE_URL}">
                                        {WEBSITE_URL}
                                    </a>
                                </p>

                            </td>
                        </tr>

                        <!-- Footer -->

                        <tr>
                            <td
                                style="
                                    background:#f8fafc;
                                    text-align:center;
                                    padding:20px;
                                    color:#64748b;
                                    font-size:13px;
                                "
                            >
                                © Task Manager Notification System
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    """        