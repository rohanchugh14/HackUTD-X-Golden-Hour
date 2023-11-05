import React from "react";

import { Button, Stack, Input } from "@chakra-ui/react";

const DataUpload = () => {
  const [weatherFile, setWeatherFile] = React.useState<File | null>(null); 
  const [sensorFile, setSensorFile] = React.useState<File | null>(null);
  const handleWeatherUpload: React.ChangeEventHandler<HTMLInputElement> = (event)  => {
    // handle weather upload
    if (!event.target.files || event.target.files.length === 0) {
      return
    }
    setWeatherFile(event.target.files[0])
  };

  const handleSensorUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    // handle sensor upload
    if (!event.target.files || event.target.files.length === 0) {
      return
    }
    setSensorFile(event.target.files[0])
  };

  const handleSubmit = async () => {
    // make fetch request with two files as multipart form data to localhost:3001/upload
    const formData = new FormData()
    formData.append('weather', weatherFile as Blob)
    formData.append('sensor', sensorFile as Blob)
    const res = await fetch('http://35.188.3.31:3001/upload', {
      method: 'POST',
      body: formData
    })
    console.log(res)
    const data = await res.json()
    console.log(data.output)
    // handle submit
  };

  return (
    <Stack
      align={"center"}
      justify={"center"}
      height="calc(100vh - 117px)"
      direction="column"
    >
      <Stack
        direction="column"
        spacing={12}
        align="center"
        justify="center"
        width="50%"
      >
        <Input
          type="file"
          id="weather-upload"
          onChange={handleWeatherUpload}
          display="none"
        />
        <Button
          as="label"
          htmlFor="weather-upload"
          cursor="pointer"
          bg="#A8C5A9"
          color="black"
          borderRadius="full"
          fontFamily={"Inter"}
          fontWeight={"800"}
          fontSize={"30px"}
          py={8}
          filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));"
          width="100%"
        >
          Upload Weather CSV
        </Button>
        <Input
          type="file"
          id="sensor-upload"
          onChange={handleSensorUpload}
          display="none"
        />
        <Button
          as="label"
          htmlFor="sensor-upload"
          cursor="pointer"
          bg="#A8C5A9"
          color="black"
          borderRadius="full"
          fontFamily={"Inter"}
          fontWeight={"800"}
          fontSize={"30px"}
          py={8}
          width="100%"
          filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));"
        >
          Upload Sensor CSV
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          bg="#A9A4A4"
          color="white"
          borderRadius="full"
          fontFamily={"Inter"}
          fontWeight={"800"}
          mt={6}
          fontSize={"50px"}
          py={12}
          width="100%"
          filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));"
        >
          SUBMIT
        </Button>
      </Stack>
    </Stack>
  );
};

export default DataUpload;
