"""Add named foreign key constraints to Order

Revision ID: b3b15f23c81f
Revises: 52f1d4371a58
Create Date: 2025-03-23 08:54:31.743388

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3b15f23c81f'
down_revision = '52f1d4371a58'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.add_column(sa.Column('claimed_by', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_order_claimed_by', 'user', ['claimed_by'], ['user_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.drop_constraint('fk_order_claimed_by', type_='foreignkey')
        batch_op.drop_column('claimed_by')

    # ### end Alembic commands ###
