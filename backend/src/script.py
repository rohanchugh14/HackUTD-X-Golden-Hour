import sys
import os

def get_file_size(file_path):
    # Get the file size in bytes
    return os.path.getsize(file_path)

def get_number_of_rows(file_path):
    # Count the number of rows in the CSV
    with open(file_path, 'r') as file:
        return sum(1 for row in file)

def print_file_info(file_path):
    size = get_file_size(file_path)
    rows = get_number_of_rows(file_path)
    print(f'File: {file_path}')
    print(f'Size: {size} bytes')
    print(f'Rows: {rows}')

def delete_file(file_path):
    # Delete the file
    os.remove(file_path)
    print(f'Deleted: {file_path}')

if __name__ == '__main__':
    if len(sys.argv) == 3:
        print("made it into here")
        print_file_info(sys.argv[1])
        print_file_info(sys.argv[2])
        delete_file(sys.argv[1])
        delete_file(sys.argv[2])
    else:
        print("Error: script.py requires exactly two arguments (paths to CSV files).")
