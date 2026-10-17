"""Persist profile name and email update preference.

Revision ID: 0003_profile_preferences
Revises: 0002_role_workspaces
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003_profile_preferences"
down_revision: str | None = "0002_role_workspaces"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_updates_enabled",
            sa.Boolean(),
            server_default=sa.true(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "email_updates_enabled")