import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

const defaultFontSize = 54;
const minFontSize = 36;
const maxFontSize = 72;

export default function FontSizeSlider({
  value,
  onChange,
}: {
  value?: number;
  onChange: (value: number) => void;
}) {
  useEffect(() => {
    const fontSize = localStorage.getItem("previewFontSize");
    onChange(parseInt(fontSize || defaultFontSize.toString()));
  }, []);

  const [uncommittedValue, setUncommittedValue] = useState(value);

  const handleChange = (value: number) => {
    setUncommittedValue(value);
    onChange(value);
    localStorage.setItem("previewFontSize", value.toString());
  };

  useEffect(() => {
    setUncommittedValue(value);
  }, [value]);

  return (
    <div>
      <Label htmlFor="fontSize">Rozmiar tekstu: {uncommittedValue}</Label>
      <Slider
        id="fontSize"
        min={minFontSize}
        max={maxFontSize}
        value={[uncommittedValue ?? defaultFontSize]}
        onValueCommit={([value]) => handleChange(value)}
        onValueChange={([value]) => setUncommittedValue(value)}
      />
    </div>
  );
}
