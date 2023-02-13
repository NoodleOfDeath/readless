import React, { useState, FormEvent } from "react";
import { Button, TextField } from "@mui/material";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-top: 64px;
  padding: 24px;
  max-width: 500px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
`;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Name: ${name}\nEmail: ${email}\nFeedback: ${feedback}`);
    // TODO: send form data to server or email
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <TextField
        required
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        required
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        label="Feedback"
        variant="outlined"
        multiline
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </StyledForm>
  );
}
