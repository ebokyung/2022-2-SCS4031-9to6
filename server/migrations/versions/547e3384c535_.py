"""empty message

Revision ID: 547e3384c535
Revises: 82b47e93efe4
Create Date: 2022-11-13 23:05:43.883606

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '547e3384c535'
down_revision = '82b47e93efe4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bookmark',
    sa.Column('memberID', sa.String(length=20), nullable=False),
    sa.Column('cctvID', sa.String(length=7), nullable=False),
    sa.PrimaryKeyConstraint('memberID', 'cctvID')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('bookmark')
    # ### end Alembic commands ###
