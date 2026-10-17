import argparse
from getpass import getpass

from sqlalchemy import select

from database.connection import SessionLocal
from models.user import User
from models.workspace import SupervisorProfile
from services.auth_service import hash_password


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Provision a privileged account from a trusted local operator session."
    )
    parser.add_argument("--role", choices=("coordinator", "supervisor"), required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--email", required=True)
    args = parser.parse_args()

    if SessionLocal is None:
        parser.error("Set FYPTRACK_DATABASE_URL before provisioning accounts.")
    password = getpass("Initial password (not echoed): ")
    confirmation = getpass("Confirm initial password: ")
    if len(password.encode("utf-8")) < 8 or len(password.encode("utf-8")) > 72:
        parser.error("Password must be between 8 and 72 UTF-8 bytes.")
    if password != confirmation:
        parser.error("Passwords do not match.")

    email = args.email.strip().lower()
    with SessionLocal() as db:
        if db.scalar(select(User.id).where(User.email == email)) is not None:
            parser.error("An account already exists for this email.")
        user = User(
            full_name=args.name.strip(),
            email=email,
            password_hash=hash_password(password),
            role=args.role,
        )
        db.add(user)
        db.flush()
        if args.role == "supervisor":
            db.add(SupervisorProfile(user=user))
        db.commit()
    print(f"Provisioned {args.role} account for {email}.")


if __name__ == "__main__":
    main()