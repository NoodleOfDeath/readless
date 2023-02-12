import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";

interface Option {
  text: string;
  votes: number;
}

interface Props {
  name: string;
  options: Option[];
}

const Poll: React.FC<Props> = ({ name, options }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = options.find((opt) => opt.text === event.target.value);
    if (option) setSelectedOption(option);
  };

  return (
    <div>
      <Typography variant="h5">{name}</Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="options"
          name="options"
          value={selectedOption ? selectedOption.text : ""}
          onChange={handleOptionChange}
        >
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.text}
              control={<Radio />}
              label={`${option.text}: ${option.votes} votes`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default Poll;
