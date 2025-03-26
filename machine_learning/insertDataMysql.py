
import pandas as pd
import mysql.connector

# Database connection details
db_config = {
    'host': 'localhost',       # Change if your MySQL server is not running locally
    'user': 'root',            # Your MySQL username
    'password': 'MATpoochh1.', # Your MySQL password
    'database': 'dr_app'       # Name of your database
}

# Excel file path
excel_file_path = r'd:\FYP\dr_app\machine_learning\Data.xlsx'

# Table name to insert data into
table_name = "disease_records"

# Read the Excel file into a pandas DataFrame
data = pd.read_excel(excel_file_path)

# Ensure the DataFrame columns match the database table structure (excluding 'id' which is auto-incremented)
data.columns = ['date', 'state', 'disease', 'disease_count', 'month_year']

# Create a connection to MySQL
connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()

# Insert query using parameterized values to prevent SQL syntax errors
insert_query = f"""
    INSERT INTO {table_name} (date, state, disease, disease_count, month_year)
    VALUES (%s, %s, %s, %s, %s);
"""

# Iterate over the rows in the DataFrame and insert into MySQL
for index, row in data.iterrows():
    # Convert NaN values to None for MySQL
    row_data = [None if pd.isna(value) else value for value in row]
    cursor.execute(insert_query, row_data)

# Commit the transaction and close the connection
connection.commit()
cursor.close()
connection.close()

print("Data has been successfully inserted into the MySQL table.")