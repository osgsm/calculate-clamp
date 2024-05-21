import { Form, ActionPanel, Action, Clipboard, showHUD, closeMainWindow } from "@raycast/api";
import { useState } from "react";

type Values = {
  minSize: number;
  maxSize: number;
  minViewport: number;
  maxViewport: number;
  useTailwind: boolean;
};

const convertToRem = (value: number) => {
  return parseFloat((value / 16).toFixed(3));
};

const calculateOutput = (values: Omit<Values, "useTailwind">) => {
  const { minSize, maxSize, minViewport, maxViewport } = values;

  const changeRate = (maxSize - minSize) / (maxViewport - minViewport);
  const vw = Number((changeRate * 100).toFixed(3));
  const baseSize = Number((maxSize - maxViewport * changeRate).toFixed(3));

  const output = `clamp(${convertToRem(minSize)}rem, ${vw}vw + ${convertToRem(baseSize)}rem, ${convertToRem(maxSize)}rem)`;

  return output;
};

export default function Command() {
  const [minSize, setMinSize] = useState(32);
  const [maxSize, setMaxSize] = useState(48);
  const [minViewport, setMinViewport] = useState(400);
  const [maxViewport, setMaxViewport] = useState(1600);
  const [useTailwind, setUseTailwind] = useState(false);

  const output = calculateOutput({ minSize, maxSize, minViewport, maxViewport });

  async function handleSubmit() {
    await Clipboard.copy(useTailwind ? output.replaceAll(" ", "") : output);
    await showHUD("Copied to clipboard");
    await closeMainWindow();
  }

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Copy to Clipboard" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.Description text={`Result: ${useTailwind ? output.replaceAll(" ", "") : output}`} />
        <Form.TextField
          id="min-size"
          title="Min Size (px) "
          placeholder="Enter minimum size in pixels"
          storeValue
          onChange={(value) => setMinSize(Number(value))}
        />
        <Form.TextField
          id="max-size"
          title="Max Size (px) "
          placeholder="Enter maximum size in pixels"
          storeValue
          onChange={(value) => setMaxSize(Number(value))}
        />
        <Form.TextField
          id="min-viewport"
          title="Min Viewport (px) "
          placeholder="Enter minimum viewport width in pixels"
          storeValue
          onChange={(value) => setMinViewport(Number(value))}
        />
        <Form.TextField
          id="max-viewport"
          title="Max Viewport (px) "
          placeholder="Enter maximum viewport width in pixels"
          storeValue
          onChange={(value) => setMaxViewport(Number(value))}
        />
        <Form.Separator />
        <Form.Checkbox
          id="use-tailwind"
          title="Use Tailwind CSS"
          label=""
          storeValue
          onChange={(value) => setUseTailwind(value)}
        />
      </Form>
    </>
  );
}
