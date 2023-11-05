import { Stack } from "@chakra-ui/react";

const Home = () => {
  return (
    <Stack
      spacing={4}
      p="1rem"
      direction="row"
      justifyContent="space-between"
      m={5}
    >
      <Stack width="33%" height="600px" bg="#A8C5A9" borderRadius="xl" m={3} />
      <Stack width="33%" height="600px" bg="#A8C5A9" borderRadius="xl" m={3} />
      <Stack width="33%" height="600px" bg="#A8C5A9" borderRadius="xl" m={3} />
    </Stack>
  );
};

export default Home;
