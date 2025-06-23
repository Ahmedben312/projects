import { extendTheme } from "@chakra-ui/theme-utils";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
});

export default theme;
