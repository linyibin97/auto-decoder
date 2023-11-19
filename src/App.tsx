import React from "react";
import ReactDOM from "react-dom/client";
import {
  ThemeProvider,
  BaseStyles,
  PageLayout,
  Textarea,
  Heading,
  Select,
  FormControl,
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
  LIGHT,
  DARK,
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

  const clear = () => {
    setRawText("");
    setEncodedText("");
  };

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
              <FormControl>
                <FormControl.Label>Method</FormControl.Label>
                <Select
                  value={currTrans.toString()}
                  onChange={(e) => {
                    clear();
                    setCurrTrans(+e.target.value);
                  }}
                >
                  <Select.Option value={Transformer.URIComponent.toString()}>
                    URIComponent
                  </Select.Option>
                  <Select.Option value={Transformer.URI.toString()}>
                    URI
                  </Select.Option>
                </Select>
           
              </FormControl>
              <FormControl>
              <FormControl.Label>Darkmode</FormControl.Label>
                <Select
                  value={colorMode.toString()}
                  onChange={(e) => {
                    setColorMode(+e.target.value);
                  }}
                >
                  <Select.Option value={ColorMode.AUTO.toString()}>
                    auto
                  </Select.Option>
                  <Select.Option value={ColorMode.LIGHT.toString()}>
                    light
                  </Select.Option>
                  <Select.Option value={ColorMode.DARK.toString()}>
                    dark
                  </Select.Option>
                </Select>
              </FormControl>
          
            </PageLayout.Pane>
          </PageLayout>
        </BaseStyles>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
