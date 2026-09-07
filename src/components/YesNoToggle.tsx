import React from "react";
import RadioGroup from "./RadioGroup";

interface Props {
  value: boolean | null;
  onChange: (v: boolean) => void;
}

const YesNoToggle: React.FC<Props> = ({ value, onChange }) => {
  const selected = value === null ? null : value ? "Yes" : "No";

  return (
    <RadioGroup
      options={["Yes", "No"]}
      value={selected}
      onSelect={(opt) => onChange(opt === "Yes")}
    />
  );
};

export default YesNoToggle;
