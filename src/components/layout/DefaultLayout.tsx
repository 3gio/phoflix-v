import { Box } from "@mui/joy";
import Navigation from "./Navigation/Navigation";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { scrollToTop } from "../../utils";
import Footer from "./Footer";
import ToastContainer from "../ToastContainer";

interface IProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: IProps) => {
  const params = useParams();

  useEffect(() => scrollToTop(), [params]);

  return (
    <>
      <Box
        sx={{
          marginTop: "60px",
          overflow: "hidden",
        }}
      >
        <Navigation />
        <Box
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: {
              xs: "12px",
              sm: "12px 16px",
              md: "16px 24px",
              lg: "24px 32px",
            },
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>

      <ToastContainer />
    </>
  );
};

export default DefaultLayout;
