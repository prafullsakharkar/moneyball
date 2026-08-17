"""add extension column to files

Revision ID: 34bc5608e31a
Revises: 6ed2a6cb56a8
Create Date: 2026-08-12 06:11:29.494347
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "34bc5608e31a"
down_revision: str | None = "6ed2a6cb56a8"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("files", sa.Column("extension", sa.String(length=32), nullable=True))


def downgrade() -> None:
    op.drop_column("files", "extension")
