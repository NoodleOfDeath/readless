import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Stack, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import Page from "@/components/layout/Page";

type ContactFormData = {
  name: string;
  email: string;
  feedback: string;
};

type FormField = {
  type: "text" | "password";
  label: string;
  required?: boolean;
  name: keyof ContactFormData;
};

const FORM_FIELDS: FormField[] = [
  {
    type: "text",
    label: "Name",
    name: "name",
  },
  {
    type: "text",
    label: "Email",
    name: "email",
    required: true,
  },
  {
    type: "text",
    label: "Feedback",
    name: "feedback",
    required: true,
  },
];

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 24px;
  max-width: 500px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
`;

const StyledTextField = styled(TextField)``;

export default function ContactPage() {
  const { register, handleSubmit } = useForm<ContactFormData>();

  const onSubmit = React.useCallback<SubmitHandler<ContactFormData>>((data) => {
    console.log(data);
  }, []);

  return (
    <Page>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h4">
            What would you like ChatGPT to talk about next week?
          </Typography>
          {FORM_FIELDS.map((field) => {
            if (field.type === "text") {
              return (
                <StyledTextField
                  key={field.name}
                  label={field.label}
                  variant="outlined"
                  required={field.required}
                  {...register(field.name, { required: field.required })}
                />
              );
            }
            return null;
          })}
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </StyledForm>
    </Page>
  );
}
