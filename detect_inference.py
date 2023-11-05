import sys
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def open_csv(sensor_file_path):
    sensor_df = pd.read_csv(sensor_file_path)
    return sensor_df

def process_sensor_data_detection(sensor_df):
    # create a numpy array with the same shape as detection_input
    data = np.empty((24*sensor_df.shape[0], 3), dtype=object)

    # loop through each row in sensor_readings dataframe
    outer_index = 0
    for index, row in sensor_df.iterrows():
        # loop through each sensor in the row
        for col in sensor_df.columns:
            if col not in ['Unnamed: 0', 'time']:
                value = row[col].astype(float)
                leak_probability = 0
                data[outer_index] = [row['time'], value, leak_probability]
                outer_index += 1

    # create the dataframe from the numpy array
    detection_input = pd.DataFrame(data, columns=['time', 'value', 'leak_probability'])

    # remove rows with all values none
    detection_input = detection_input.dropna()

    return detection_input

def load_model(model_name):
    # load the model from disk
    loaded_model = pickle.load(open(model_name, 'rb'))
    return loaded_model

def predict_leak(detection_input, loaded_model):
#drop time column
    # make predictions on the input data
    detection_input = detection_input.drop(columns=['leak_probability'])
    time = detection_input['time']
    detection_input = detection_input.drop(columns=['time'])

    scaler = StandardScaler()
    detection_input = scaler.fit_transform(detection_input)
    
    leak_probability = loaded_model.predict(detection_input)
    leaks = set()
    for time, leak in zip(time, leak_probability):
        if leak > 0:
            leaks.add(time)

    return leaks

if __name__ == '__main__':
    if len(sys.argv) == 3:

        # get input file names
        sensor_data = sys.argv[1]
        model_name = sys.argv[2]

        # process inputs to fit models
        sensor_df = open_csv(sensor_data)
        detection_input = process_sensor_data_detection(sensor_df)

        # load model
        loaded_model = load_model(model_name)

        # make predictions
        list_of_leaks = predict_leak(detection_input, loaded_model)

        # print results
        # print(f'List of leaks: {list_of_leaks}')

        #calculate continuous intervals srtart times and end times of leaks
        continuous_intervals = []
        start_time = None
        end_time = None
        for time in list_of_leaks:
            if start_time == None:
                start_time = time
                end_time = time
            elif time == end_time + 1:
                end_time = time
            else:
                continuous_intervals.append((start_time, end_time))
                start_time = time
                end_time = time

        message = ''
        for interval in continuous_intervals:
            message += f'{interval[0]} None, '
        print(message[:-2])
    else:
        print("Error: script.py requires exactly two arguments (paths to CSV files).")
