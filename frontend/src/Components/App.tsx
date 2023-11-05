import { ChakraProvider, theme } from "@chakra-ui/react";
import Home from "./Home";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataUpload from "./DataUpload";
import DataAnalysis from "./DataAnalysis";
import PastLeaks from "./PastLeaks";
export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-upload" element={<DataUpload />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/past-leaks" element={<PastLeaks />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
