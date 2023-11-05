import { Heading, Image, Stack } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <Heading as="h1" size="2xl" textAlign="center" m={5} fontFamily={"Inter"}>
        Methane Leak Detection
      </Heading>
      <Stack direction="row" borderRadius={"xl"} m={3} justifyContent={"center"} alignItems={"center"}>
        <Stack borderRadius="xl" m={3}>
          {" "}
          <Image src="/leak.png" />
        </Stack>
      </Stack>
      <Stack
        spacing={4}
        p="1rem"
        direction="row"
        justifyContent="space-between"
        m={5}
      >
        <Stack borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_1.png" />{" "}
        </Stack>
        <Stack borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_2.png" />{" "}
        </Stack>
        <Stack borderRadius="xl" m={3}>
          {" "}
          <Image src="/Data_Leak_3.png" />{" "}
        </Stack>
      </Stack>
    </>
  );
};

export default Home;
