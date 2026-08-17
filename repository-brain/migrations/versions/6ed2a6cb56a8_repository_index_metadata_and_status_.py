"""repository index metadata and status enum

Revision ID: 6ed2a6cb56a8
Revises: cb227b2a12fc
Create Date: 2026-08-12 05:27:44.951588
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6ed2a6cb56a8"
down_revision: str | None = "cb227b2a12fc"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

#: Status values the application writes to ``repositories.status``. These must
#: be valid members of the ``repositorystatus`` PostgreSQL enum whenever the
#: live schema uses one, so inserting a row with status 'registered' (or any
#: other value below) never fails with "invalid input value for enum".
_REPOSITORY_STATUS_VALUES = ("registered", "scanning", "scanned", "failed")


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    # Persistent repository knowledge metadata.
    op.add_column(
        "repositories",
        sa.Column("root_path", sa.String(length=1024), nullable=True),
    )
    op.add_column(
        "repositories",
        sa.Column("language_set", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
    )
    op.add_column(
        "repositories",
        sa.Column("framework_set", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
    )
    op.execute("UPDATE repositories SET root_path = path WHERE root_path IS NULL")

    # Align the repositories.status PostgreSQL enum (when present) with every
    # value the application writes. Idempotent and a no-op on SQLite or when no
    # such enum exists.
    if dialect == "postgresql":
        statements = " ".join(
            f"ALTER TYPE repositorystatus ADD VALUE IF NOT EXISTS '{value}';"
            for value in _REPOSITORY_STATUS_VALUES
        )
        with op.get_context().autocommit_block():
            op.execute(
                "DO $$ BEGIN "
                "IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'repositorystatus') "
                f"THEN {statements} END IF; END $$;"
            )


def downgrade() -> None:
    op.drop_column("repositories", "framework_set")
    op.drop_column("repositories", "language_set")
    op.drop_column("repositories", "root_path")
