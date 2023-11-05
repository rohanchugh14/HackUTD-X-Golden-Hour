
import { useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";

const OldHome = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Do something with the selected file
    console.log(file);
  };

  return (
    <Box p={4}>
      <Center>
        <Heading as="h1" size="xl">
          Welcome to my app!
        </Heading>
      </Center>
      <Box mt={8}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Select a file</FormLabel>
            <Input type="file" onChange={handleFileChange} />
          </FormControl>
          <Button type="submit" mt={4} disabled={!file}>
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default OldHome;
