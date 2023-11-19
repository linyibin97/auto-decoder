import { PageLayout, Box, Textarea, Button } from "@primer/react";
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

  const [currTrans, setCurrTrans] = useState<Transformer>(
    Transformer.URIComponent
  );

  return (
    <PageLayout
      sx={{ bg: "canvas.default", minHeight: "100vh" }}
      padding="none"
    >
      <PageLayout.Content padding="normal" sx={{ height: "100vh" }}>
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
        />
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
        />
      </PageLayout.Content>
      <PageLayout.Pane sx={{ bg: "canvas.subtle" }}>
        <Button
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
      </PageLayout.Pane>
    </PageLayout>
  );
}

export default App;
