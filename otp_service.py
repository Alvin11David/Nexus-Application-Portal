#!/usr/bin/env python3
"""
Self-hosted 5-digit OTP service using only Python standard library.

Endpoints:
- POST /api/otp/send   {"email": "user@example.com"}
- POST /api/otp/verify {"email": "user@example.com", "otp": "12345"}

Email delivery uses SMTP from your own server (default: localhost:25).
No third-party Python packages are required.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import secrets
import sqlite3
import time
from dataclasses import dataclass
from email.message import EmailMessage
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from smtplib import SMTP, SMTP_SSL, SMTPException
from typing import Any

DB_PATH = os.getenv("OTP_DB_PATH", "./otp_service.db")
HOST = os.getenv("OTP_HOST", "127.0.0.1")
PORT = int(os.getenv("OTP_PORT", "5055"))
OTP_TTL_SECONDS = int(os.getenv("OTP_TTL_SECONDS", "300"))
OTP_MIN_RESEND_SECONDS = int(os.getenv("OTP_MIN_RESEND_SECONDS", "60"))
OTP_MAX_VERIFY_ATTEMPTS = int(os.getenv("OTP_MAX_VERIFY_ATTEMPTS", "5"))
SMTP_HOST = os.getenv("OTP_SMTP_HOST", "127.0.0.1")
SMTP_PORT = int(os.getenv("OTP_SMTP_PORT", "25"))
SMTP_USER = os.getenv("OTP_SMTP_USER", "").strip()
SMTP_PASS = os.getenv("OTP_SMTP_PASS", "")
SMTP_USE_TLS = os.getenv("OTP_SMTP_TLS", "0") == "1"
SMTP_USE_SSL = os.getenv("OTP_SMTP_SSL", "0") == "1"
MAIL_FROM = os.getenv("OTP_MAIL_FROM", "no-reply@institution-portal.local")
ALLOW_DEV_CONSOLE_OTP = os.getenv("OTP_DEV_CONSOLE", "0") == "1"
OTP_LOCAL_FALLBACK = os.getenv("OTP_LOCAL_FALLBACK", "0") == "1"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_local_host(value: str) -> bool:
    return value in {"127.0.0.1", "localhost", "::1"}


@dataclass
class OtpRecord:
    email: str
    code_hash: str
    salt: str
    expires_at: int
    attempts: int
    created_at: int


def db_connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db_connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS otp_codes (
                email TEXT PRIMARY KEY,
                code_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL
            )
            """
        )
        conn.commit()


def now_ts() -> int:
    return int(time.time())


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email))


def generate_otp() -> str:
    # 00000-99999, always 5 chars
    return f"{secrets.randbelow(100000):05d}"


def hash_otp(otp: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{otp}".encode("utf-8")).hexdigest()


def load_record(email: str) -> OtpRecord | None:
    with db_connect() as conn:
        row = conn.execute(
            "SELECT email, code_hash, salt, expires_at, attempts, created_at FROM otp_codes WHERE email = ?",
            (email,),
        ).fetchone()
        if not row:
            return None
        return OtpRecord(
            email=row["email"],
            code_hash=row["code_hash"],
            salt=row["salt"],
            expires_at=row["expires_at"],
            attempts=row["attempts"],
            created_at=row["created_at"],
        )


def save_record(email: str, otp: str) -> None:
    salt = secrets.token_hex(16)
    created_at = now_ts()
    expires_at = created_at + OTP_TTL_SECONDS
    code_hash = hash_otp(otp, salt)

    with db_connect() as conn:
        conn.execute(
            """
            INSERT INTO otp_codes(email, code_hash, salt, expires_at, attempts, created_at)
            VALUES (?, ?, ?, ?, 0, ?)
            ON CONFLICT(email) DO UPDATE SET
                code_hash = excluded.code_hash,
                salt = excluded.salt,
                expires_at = excluded.expires_at,
                attempts = 0,
                created_at = excluded.created_at
            """,
            (email, code_hash, salt, expires_at, created_at),
        )
        conn.commit()


def delete_record(email: str) -> None:
    with db_connect() as conn:
        conn.execute("DELETE FROM otp_codes WHERE email = ?", (email,))
        conn.commit()


def increment_attempts(email: str) -> int:
    with db_connect() as conn:
        conn.execute(
            "UPDATE otp_codes SET attempts = attempts + 1 WHERE email = ?",
            (email,),
        )
        row = conn.execute(
            "SELECT attempts FROM otp_codes WHERE email = ?",
            (email,),
        ).fetchone()
        conn.commit()
    return int(row["attempts"]) if row else OTP_MAX_VERIFY_ATTEMPTS


def send_otp_email(email_to: str, otp: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Your 5-digit verification code"
    msg["From"] = MAIL_FROM
    msg["To"] = email_to
    msg.set_content(
        "\n".join(
            [
                "Your verification code is:",
                "",
                f"  {otp}",
                "",
                f"This code expires in {OTP_TTL_SECONDS // 60} minutes.",
                "If you did not request this, you can ignore this message.",
            ]
        )
    )

    if SMTP_USE_SSL:
        with SMTP_SSL(host=SMTP_HOST, port=SMTP_PORT, timeout=10) as smtp:
            if SMTP_USER and SMTP_PASS:
                smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)
        return

    with SMTP(host=SMTP_HOST, port=SMTP_PORT, timeout=10) as smtp:
        if SMTP_USE_TLS:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
        if SMTP_USER and SMTP_PASS:
            smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)


class OtpHandler(BaseHTTPRequestHandler):
    server_version = "OtpService/1.0"

    def _send_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self) -> None:  # noqa: N802
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8") or "{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid JSON body."})
            return

        if self.path == "/api/otp/send":
            self._handle_send(data)
            return

        if self.path == "/api/otp/verify":
            self._handle_verify(data)
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Route not found."})

    def _handle_send(self, data: dict[str, Any]) -> None:
        email = str(data.get("email", "")).strip().lower()
        if not email or not is_valid_email(email):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Valid email is required."})
            return

        existing = load_record(email)
        now = now_ts()
        if existing and now - existing.created_at < OTP_MIN_RESEND_SECONDS:
            wait_for = OTP_MIN_RESEND_SECONDS - (now - existing.created_at)
            self._send_json(
                HTTPStatus.TOO_MANY_REQUESTS,
                {
                    "ok": False,
                    "error": f"Please wait {wait_for}s before requesting another code.",
                },
            )
            return

        otp = generate_otp()
        save_record(email, otp)

        try:
            send_otp_email(email, otp)
        except (SMTPException, OSError) as exc:
            use_local_fallback = ALLOW_DEV_CONSOLE_OTP or OTP_LOCAL_FALLBACK

            if use_local_fallback:
                print(f"[OTP DEV MODE] {email} => {otp}")
                self._send_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "message": "OTP generated in local dev mode. SMTP unavailable, code printed to server console.",
                        "devOtp": otp,
                    },
                )
                return

            delete_record(email)
            self._send_json(
                HTTPStatus.BAD_GATEWAY,
                {"ok": False, "error": f"Failed to send email via SMTP: {exc}"},
            )
            return

        self._send_json(HTTPStatus.OK, {"ok": True, "message": "OTP sent successfully."})

    def _handle_verify(self, data: dict[str, Any]) -> None:
        email = str(data.get("email", "")).strip().lower()
        otp = str(data.get("otp", "")).strip()

        if not email or not is_valid_email(email):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Valid email is required."})
            return

        if not re.fullmatch(r"\d{5}", otp):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "OTP must be exactly 5 digits."})
            return

        record = load_record(email)
        if not record:
            self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "No OTP request found."})
            return

        now = now_ts()
        if now > record.expires_at:
            delete_record(email)
            self._send_json(HTTPStatus.GONE, {"ok": False, "error": "OTP expired. Request a new one."})
            return

        if record.attempts >= OTP_MAX_VERIFY_ATTEMPTS:
            delete_record(email)
            self._send_json(HTTPStatus.FORBIDDEN, {"ok": False, "error": "Too many invalid attempts. Request a new OTP."})
            return

        incoming_hash = hash_otp(otp, record.salt)
        if not secrets.compare_digest(incoming_hash, record.code_hash):
            attempts = increment_attempts(email)
            remaining = max(0, OTP_MAX_VERIFY_ATTEMPTS - attempts)
            self._send_json(
                HTTPStatus.UNAUTHORIZED,
                {
                    "ok": False,
                    "error": "Invalid OTP.",
                    "remainingAttempts": remaining,
                },
            )
            return

        delete_record(email)
        self._send_json(HTTPStatus.OK, {"ok": True, "verified": True})


def main() -> None:
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), OtpHandler)
    print(f"OTP service running on http://{HOST}:{PORT}")
    print(f"Using SMTP {SMTP_HOST}:{SMTP_PORT} from {MAIL_FROM}")
    print(f"SMTP security: ssl={SMTP_USE_SSL} tls={SMTP_USE_TLS} auth={'yes' if SMTP_USER else 'no'}")
    if OTP_LOCAL_FALLBACK:
        print("Local OTP fallback is enabled. If SMTP is unavailable, OTP will be printed to this console.")
    server.serve_forever()


if __name__ == "__main__":
    main()
