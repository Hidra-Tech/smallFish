cd database/
python handle_db.py delete-table user
python handle_db.py delete-table alembic_version
cd ../
rm -r migrations/
flask db init
flask db migrate
flask db upgrade