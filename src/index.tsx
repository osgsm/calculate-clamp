import { Form, ActionPanel, Action, Clipboard, showToast, closeMainWindow } from "@raycast/api";

type Values = {
  "min-size": number;
  "max-size": number;
  "min-viewport": number;
  "max-viewport": number;
  "use-tailwind": boolean;
};

export default function Command() {
  const calculateOutput = (values: Values) => {
    const minSize = Number(values["min-size"]);
    const maxSize = Number(values["max-size"]);
    const minViewport = Number(values["min-viewport"]);
    const maxViewport = Number(values["max-viewport"]);

    const changeRate = (maxSize - minSize) / (maxViewport - minViewport);
    const vw = Number((changeRate * 100).toFixed(3));
    const baseSize = Number((maxSize - maxViewport * changeRate).toFixed(3));

    const output = values["use-tailwind"]
      ? `clamp(${parseFloat((minSize / 16).toFixed(3))}rem,${vw}vw+${parseFloat((baseSize / 16).toFixed(3))}rem,${parseFloat((maxSize / 16).toFixed(3))}rem)`
      : `clamp(${minSize}px, ${vw}vw + ${baseSize}px, ${maxSize}px)`;

    return output;
  };

  async function handleSubmit(values: Values) {
    await Clipboard.copy(calculateOutput(values));
    await showToast({ title: "Copied to clipboard", message: "" });
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
        <Form.Description text="Enter the values for the clamp() function. The output will be copied to your clipboard." />
        <Form.TextField
          id="min-size"
          title="Min Size (px) "
          placeholder="Enter minimum size in pixels"
          storeValue
          defaultValue="32"
        />
        <Form.TextField
          id="max-size"
          title="Max Size (px) "
          placeholder="Enter maximum size in pixels"
          storeValue
          defaultValue="48"
        />
        <Form.TextField
          id="min-viewport"
          title="Min Viewport (px) "
          placeholder="Enter minimum viewport size in pixels"
          storeValue
          defaultValue="400"
        />
        <Form.TextField
          id="max-viewport"
          title="Max Viewport (px) "
          placeholder="Enter maximum viewport size in pixels"
          storeValue
          defaultValue="1600"
        />
        <Form.Separator />
        <Form.Checkbox id="use-tailwind" title="Use Tailwind CSS" label="" storeValue defaultValue={false} />
      </Form>
    </>
  );
}
