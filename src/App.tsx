import React from "react";
import ReactDOM from "react-dom/client";
import {
  ThemeProvider,
  BaseStyles,
  PageLayout,
  Textarea,
  Button,
  Heading,
  ThemeProviderProps,
} from "@primer/react";
import { useState } from "react";

enum Transformer {
  URIComponent = 0,
  URI,
}

const TransformerMap = {
  [Transformer.URIComponent]: {
    encoder: encodeURIComponent,
    decoder: decodeURIComponent,
  },
  [Transformer.URI]: {
    encoder: encodeURI,
    decoder: decodeURI,
  },
};

enum ColorMode {
  AUTO = 0,
  DARK,
  LIGHT,
}

const ColorModeMap: Record<number, ThemeProviderProps["colorMode"]> = {
  [ColorMode.AUTO]: "auto",
  [ColorMode.LIGHT]: "light",
  [ColorMode.DARK]: "dark",
};

const doTransform = (
  curr: Transformer,
  key: "encoder" | "decoder",
  text: string
): string => {
  try {
    return TransformerMap[curr][key](text);
  } catch (e) {
    console.log(e);
    return "";
  }
};

function App() {
  const [rawText, setRawText] = useState<string>("");
  const [encodedText, setEncodedText] = useState<string>("");
  const [colorMode, setColorMode] = useState<ColorMode>(0);

  const [currTrans, setCurrTrans] = useState<Transformer>(
    Transformer.URIComponent
  );

  // const clear = () => {
  //   setRawText("");
  //   setEncodedText("");
  // };

  return (
    <React.StrictMode>
      <ThemeProvider colorMode={ColorModeMap[colorMode]}>
        <BaseStyles>
          <PageLayout
            sx={{ bg: "canvas.default", minHeight: "100vh" }}
            containerWidth="full"
            padding="none"
            columnGap="none"
          >
            <PageLayout.Content padding="normal" sx={{ height: "100vh" }}>
              <Heading sx={{ fontSize: 3 }}>Decoded</Heading>
              <Textarea
                block
                resize="none"
                value={rawText}
                onChange={(event) => {
                  const newRawText = event?.target?.value || "";
                  const newEncodedText =
                    doTransform(currTrans, "encoder", newRawText) || "";
                  setRawText(newRawText);
                  setEncodedText(newEncodedText);
                }}
                sx={{
                  height: "30vh",
                  marginBottom: 20,
                }}
              />
              <Heading sx={{ fontSize: 3 }}>Encoded</Heading>
              <Textarea
                block
                resize="none"
                value={encodedText}
                onChange={(event) => {
                  const newEncodedText = event?.target?.value || "";
                  const newRawText =
                    doTransform(currTrans, "decoder", newEncodedText) || "";
                  setRawText(newRawText);
                  setEncodedText(newEncodedText);
                }}
                sx={{
                  height: "30vh",
                }}
              />
            </PageLayout.Content>
            <PageLayout.Pane
              position="start"
              padding="normal"
              sx={{ bg: "canvas.subtle" }}
            >
              <Button
                block
                onClick={() => {
                  if (currTrans === Transformer.URI) {
                    setCurrTrans(Transformer.URIComponent);
                  } else {
                    setCurrTrans(Transformer.URI);
                  }
                }}
              >
                {Transformer[currTrans]}
              </Button>
              <Button
                block
                onClick={() => {
                  setColorMode((colorMode + 1) % 3);
                }}
              >
                {ColorModeMap[colorMode]}
              </Button>
            </PageLayout.Pane>
          </PageLayout>
        </BaseStyles>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
