"""Add user profiles, projects, assignments, and invitations.

Revision ID: 0002_role_workspaces
Revises: 0001_create_users
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002_role_workspaces"
down_revision: str | None = "0001_create_users"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "is_active", sa.Boolean(), server_default=sa.true(), nullable=False
        ),
    )
    op.create_table(
        "student_profiles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("department", sa.String(length=120), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_table(
        "supervisor_profiles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("department", sa.String(length=120), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.execute(
        "INSERT INTO student_profiles (user_id) "
        "SELECT id FROM users WHERE role = 'student'"
    )
    op.execute(
        "INSERT INTO supervisor_profiles (user_id) "
        "SELECT id FROM users WHERE role = 'supervisor'"
    )
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_profile_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=30), server_default="proposed", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["student_profile_id"], ["student_profiles.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "supervisor_assignments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("student_profile_id", sa.Integer(), nullable=False),
        sa.Column("supervisor_profile_id", sa.Integer(), nullable=False),
        sa.Column("assigned_by_user_id", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column(
            "assigned_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["student_profile_id"], ["student_profiles.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["supervisor_profile_id"], ["supervisor_profiles.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["assigned_by_user_id"], ["users.id"], ondelete="RESTRICT"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_supervisor_assignments_active",
        "supervisor_assignments",
        ["supervisor_profile_id", "is_active"],
    )
    op.create_index(
        "uq_supervisor_assignments_active_student",
        "supervisor_assignments",
        ["student_profile_id"],
        unique=True,
        sqlite_where=sa.text("is_active = 1"),
        postgresql_where=sa.text("is_active = true"),
    )
    op.create_table(
        "invitations",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("invited_by_user_id", sa.Integer(), nullable=False),
        sa.CheckConstraint("role = 'supervisor'", name="ck_invitations_role"),
        sa.ForeignKeyConstraint(
            ["invited_by_user_id"], ["users.id"], ondelete="RESTRICT"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_invitations_email", "invitations", ["email"])
    op.create_index(
        "ix_invitations_token_hash", "invitations", ["token_hash"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_invitations_token_hash", table_name="invitations")
    op.drop_index("ix_invitations_email", table_name="invitations")
    op.drop_table("invitations")
    op.drop_index(
        "uq_supervisor_assignments_active_student",
        table_name="supervisor_assignments",
    )
    op.drop_index(
        "ix_supervisor_assignments_active", table_name="supervisor_assignments"
    )
    op.drop_table("supervisor_assignments")
    op.drop_table("projects")
    op.drop_table("supervisor_profiles")
    op.drop_table("student_profiles")
    op.drop_column("users", "is_active")