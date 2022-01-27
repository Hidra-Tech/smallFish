import sys
import sqlite3
import pandas as pd

command = sys.argv[1]

if command=='list-tables':
    connection = sqlite3.connect('app.db')
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print([k[0] for k in cursor.fetchall()])
    connection.close()
elif command=='print-table':
    table_name = sys.argv[2]
    connection = sqlite3.connect('app.db')
    df = pd.read_sql_query("SELECT * FROM {}".format(table_name), connection)
    connection.close()
    print(df)
elif command=='delete-table':
    table_name = sys.argv[2]
    connection = sqlite3.connect('app.db')
    cursor = connection.cursor()
    cursor.execute("DROP TABLE {}".format(table_name))
    connection.commit()
    connection.close()
