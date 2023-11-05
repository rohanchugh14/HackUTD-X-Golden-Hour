import { Heading, Image, Stack } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <Heading as="h1" size="2xl" textAlign="center" m={5} fontFamily={"Inter"}>
        Data Leak Detection
      </Heading>
      <Stack
        spacing={4}
        p="1rem"
        direction="row"
        justifyContent="space-between"
        m={5}
      >
        <Stack width="33%" borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_1.png" />{" "}
        </Stack>
        <Stack width="33%" borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_2.png" />{" "}
        </Stack>
        <Stack width="33%" borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_3.png" />{" "}
        </Stack>
      </Stack>
    </>
  );
};

export default Home;
