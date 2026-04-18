import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../../theme";

export function Provider({ children }) {
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  );
}
