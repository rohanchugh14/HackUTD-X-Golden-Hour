import sys
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import sklearn

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
                
        if index % 10000 == 0:
            print(index)

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

def predict(lat, long, leaks, weather_data, sensor_readings):
    weather_data['timestamp'] = pd.to_datetime(weather_data['timestamp'])
    weather_data['timestamp'] = weather_data['timestamp'].apply(lambda x: x.timestamp())
    weather_data['timestamp'] = weather_data['timestamp'].apply(lambda x: (x // 60) * 60)

    # change the data type of the timestamp column to int
    weather_data['timestamp'] = weather_data['timestamp'].astype(int)

    weather_data.set_index('timestamp', inplace=True)
    # average all rows with same timestamp
    weather_data = weather_data.groupby('timestamp').mean()



    data = np.empty((24*sensor_readings.shape[0], 9), dtype=object)

    # loop through each row in sensor_readings dataframe
    weather_data.head()
    print(weather_data.head())
    outer_index = 0
    for index, row in sensor_readings.iterrows():
        # loop through each sensor in the row
        for col in sensor_readings.columns:
            if col not in ['Unnamed: 0', 'time']:
                longitude = col.split('_')[1]
                latitude = col.split('_')[2]
                value = row[col]

                #find weather data based on the minute of the timestamp
                try:
                    weather_data_row = weather_data.loc[int((row['time'] // 60) * 60)]
                except:
                    weather_data_row = weather_data.loc[int((row['time'] // 60) * 60) - 60]
                #unpack weather data
                temperature = weather_data_row['Temperature']
                humidity = weather_data_row['Humidity']
                pressure = weather_data_row['Barometric_Pressure']
                wind_direction = weather_data_row['Wind_Direction']
                wind_speed = weather_data_row['Wind_Speed']
        
                data[outer_index] = [row['time'], latitude, longitude, value, temperature, humidity, pressure, wind_direction, wind_speed]
                outer_index += 1
                
        if index % 10000 == 0:
            print(index)

    #convert to dataframe
    data = pd.DataFrame(data, columns=['time', 'latitude', 'longitude', 'value', 'temperature', 'humidity', 'pressure', 'wind_direction', 'wind_speed'])

    #drop rows with NaN values
    data = data.dropna()

    #convert to numpy array
    data = data.to_numpy()

    #normalize latitude and longitude
    # max_latitude = np.max(data[:, 9] + data[:, 1].astype(float))
    # min_latitude = np.min(data[:, 9] + data[:, 1].astype(float))
    # max_longitude = np.max(data[:, 10] + data[:, 2].astype(float))
    # min_longitude = np.min(data[:, 10] + data[:, 2].astype(float))

    # data[:, 9] = (data[:, 9] - min_latitude) / (max_latitude - min_latitude)
    # data[:, 10] = (data[:, 10] - min_longitude) / (max_longitude - min_longitude)
    # data[:,1] = (data[:,1].astype(float) - min_latitude) / (max_latitude - min_latitude)
    # data[:,2] = (data[:,2].astype(float) - min_longitude) / (max_longitude - min_longitude)

    #convert to dataframe
    location_input = pd.DataFrame(data, columns=['time', 'latitude', 'longitude', 'value', 'temperature', 'humidity', 'pressure', 'wind_direction', 'wind_speed'])
    location_input = location_input.sort_values(by=['time'])
    location_input['latitude'] = location_input['latitude'].astype(float)
    location_input['longitude'] = location_input['longitude'].astype(float)
    print(location_input.head())
    # latitudeMin = location_input['latitude'].min()
    # latitudeMax = location_input['latitude'].max()
    # latitudeMid = latitudeMax-latitudeMin
    # longitudeMin = location_input['longitude'].min()
    # longitudeMax = location_input['longitude'].max()
    # longitudeMid = longitudeMax-longitudeMin

    # for x in range(0, len(location_input)):
    #     location_input.loc[x, 'latitude'] = (location_input.loc[x, 'latitude'] - latitudeMin) 
    #     location_input.loc[x, 'longitude'] = (location_input.loc[x, 'longitude'] - longitudeMin)

    def min_max_normalize_longitude(longitude):
    # Adjust the range of longitude from [-180, 180] to [0, 360] for normalization
        adjusted_longitude = (longitude + 180) % 360
        # Normalize to [0, 1]
        return adjusted_longitude / 360

    def min_max_normalize_latitude(latitude):
        # Adjust the range of latitude from [-90, 90] to [0, 180] for normalization
        adjusted_latitude = latitude + 90
        # Normalize to [0, 1]
        return adjusted_latitude / 180

    # Apply the normalization to the DataFrame
    location_input['longitude'] = location_input['longitude'].apply(min_max_normalize_longitude)
    location_input['latitude'] = location_input['latitude'].apply(min_max_normalize_latitude)

    X = location_input.drop(columns=['time'])
    leak_lat = lat.predict(X)
    leak_long = long.predict(X)
    num_leaks = leaks.predict(X)

    # #unnormalize latitude and longitude
    print(leak_lat)
    leak_lat = (leak_lat * 180) - 90
    leak_long = (leak_long * 360) - 180
    print(leak_lat)
    print("------------")

    # add leak lat, long, and num_leaks to location_input
    location_input['leak_lat'] = leak_lat
    location_input['leak_long'] = leak_long
    location_input['num_leaks'] = num_leaks
    print(leak_lat)
    print(leak_long)
    print(num_leaks)
    # save leak_lat, leak_long, and num_leaks to csv
    location_input.to_csv('leak_lat_long_num_leaks.csv')

def delete_file(file_path):
    # Delete the file
    os.remove(file_path)
    print(f'Deleted: {file_path}')

if __name__ == '__main__':
    if len(sys.argv) == 4:
        print("sklearn version:", sklearn.__version__)
        print("made it into here")

        # get input file names
        sensor_data = sys.argv[1]
        weather_data = sys.argv[2]
        model_name = sys.argv[3]

        # process inputs to fit models
        sensor_df = open_csv(sensor_data)
        weather_df = open_csv(weather_data)
        # detection_input = process_sensor_data_detection(sensor_df)

        # # load model
        # loaded_model = load_model(model_name)

        # # make predictions
        # list_of_leaks = predict_leak(detection_input, loaded_model)

        # # print results
        # # print(f'List of leaks: {list_of_leaks}')

        # #calculate continuous intervals srtart times and end times of leaks
        # continuous_intervals = []
        # start_time = None
        # end_time = None
        # for time in list_of_leaks:
        #     if start_time == None:
        #         start_time = time
        #         end_time = time
        #     elif time == end_time + 1:
        #         end_time = time
        #     else:
        #         continuous_intervals.append((start_time, end_time))
        #         start_time = time
        #         end_time = time

        # # print results
        # print(f'Continuous intervals: {continuous_intervals}')
        # message = ''
        # for interval in continuous_intervals:
        #     message += f'{interval[0]}, None, {interval[1]}, None |'
        # print(message)
        # # write message[:-2] to file called {sensor_data}_leaks.txt
        # with open(f'{sensor_data}_leaks.txt', 'w') as f:
        #     f.write(message)


        # write results to file called {sensor_data}_leaks.csv
        # with open(f'{sensor_data}_leaks.csv', 'w') as f:
        #     for start, end in continuous_intervals:
        #         f.write(f'{start},{end}\n')
        lat_model = load_model('./src/leak_latitude_regressor.sav')
        long_model = load_model('./src/leak_longitude_regressor.sav')
        num_leaks = load_model('./src/num_leaks_regressor.sav')

        # predict leak latitutdes
        predict(lat_model, long_model, num_leaks, weather_df, sensor_df)
        # delete_file(sensor_data)
        # delete_file(weather_data)

    else:
        print("Error: script.py requires exactly two arguments (paths to CSV files).")
