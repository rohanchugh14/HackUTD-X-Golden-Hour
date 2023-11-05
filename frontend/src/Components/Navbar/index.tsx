import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import "./Navbar.css";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box>
      <Flex
        bg={useColorModeValue("#C8E5BB", "#C8E5BB")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={"space-between"}>
          <Link to="/">
            <Image
              src="/logo.png"
              alt="Logo"
              boxSize="100px"
              objectFit="contain"
            />
          </Link>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("#4F4747", "white");
  const linkHoverColor = useColorModeValue("white", "black");
  const location = useLocation();
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      spacing={4}
    >
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                padding={"5px 10px"}
                href={navItem.href ?? "#"}
                fontSize={"18px"}
                fontFamily={"Inter"}
                fontWeight={700}
                color={linkColor}
                transition="color 0.4s, border-color 0.4s"
                // borderBottom={location.pathname === navItem.href ? "4px solid #60AF63" : "4px solid transparent"}
                bg={
                  location.pathname === navItem.href
                    ? "#A5BE9A"
                    : "transparent"
                }
                rounded="full"
                _hover={{
                  borderBottomColor: "#60AF63",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "DATA UPLOAD",
    href: "/data-upload",
  },
  {
    label: "DATA ANALYSIS",
    href: "/data-analysis",
  },
  {
    label: "PAST LEAKS",
    href: "/past-leaks",
  },
];
