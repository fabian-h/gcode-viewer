/* 
Copyright 2019 Fabian Hiller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

import * as React from "react";
import { observer } from "mobx-react-lite";
import OctoprintStore from "app/OctoprintStore";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import {
  Dialog,
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Callout
} from "@blueprintjs/core";
import styled from "styled-components";
import * as Yup from "yup";
import { Machine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import { useState } from "react";

interface IProps {}

interface IState {
  isOpen: boolean;
}

const StyledCallout = styled(Callout)`
  margin-bottom: 15px;
`;

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(40, "Too Long!")
    .required("Required"),
  hostname: Yup.string().required("Required"),
  port: Yup.number()
    .integer("Invalid port number")
    .required("Required"),
  user: Yup.string().required("Required")
});

const octoprintAddMachine = Machine({
  id: "octoprint-add",
  initial: "idle",
  states: {
    idle: {
      on: {
        CONNECT: "connecting"
      }
    },
    connecting: {
      on: {
        CONNECTION_SUCCESS: "polling_for_auth",
        CONNECTION_FAILURE: "connection_failed"
      }
    },
    polling_for_auth: {
      on: {
        AUTH_REQUEST_ACCEPTED: "auth_successful",
        AUTH_REQUEST_DENIED: "auth_failed"
      }
    },
    connection_failed: {
      on: {
        CONNECT: "connecting"
      }
    },
    auth_successful: {
      on: {
        RESET: "idle"
      }
    },
    auth_failed: {
      on: {
        CONNECT: "connecting"
      }
    }
  }
});

async function connectToOctoprint() {
  try {
    const response = await fetch("http://localhost:5000/plugin/appkeys/probe");
    return response.status === 204;
  } catch (e) {
    return false;
  }
}

async function pollingForAuth() {
  const response = await fetch("http://localhost:5000/plugin/appkeys/request", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      app: "G-Code viewer"
    })
  });
  const app_token = (await response.json()).app_token;
  while (true) {
    const pollResponse = await fetch(
      "http://localhost:5000/plugin/appkeys/request/" + app_token
    );
    if (pollResponse.status === 200) {
      const body = await pollResponse.json();
      return body.api_key;
    }
    if (pollResponse.status === 404) {
      return null;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

const OctoprintAddDialog = observer(() => {
  const [isOpen, setOpen] = useState(false);

  const [currentState, send] = useMachine(octoprintAddMachine);

  return (
    <>
      <Button
        className="bp3-minimal"
        icon="cloud-download"
        text="Octoprint"
        onClick={() => setOpen(true)}
      />
      <Dialog
        isOpen={isOpen}
        icon="cloud-download"
        title="Add Octoprint server"
        onClose={() => {
          setOpen(false);
          send("RESET");
        }}
      >
        <Formik
          initialValues={{
            name: "Test",
            hostname: "localhost",
            port: "5000",
            user: ""
          }}
          onSubmit={async values => {
            send("CONNECT");
            const x = await connectToOctoprint();
            console.log(x);
            if (x) {
              send("CONNECTION_SUCCESS");
              const apikey = await pollingForAuth();

              if (apikey) {
                const server = { apikey: apikey, ...values };
                OctoprintStore.addServer(server);
                send("AUTH_REQUEST_ACCEPTED");
              } else {
                send("AUTH_REQUEST_DENIED");
              }
            } else {
              send("CONNECTION_FAILURE");
            }
            //setOpen(false);
          }}
          validationSchema={ValidationSchema}
          render={({ isSubmitting }) => (
            <Form>
              <div className={Classes.DIALOG_BODY}>
                <StyledCallout>
                  <p>
                    Add an Octoprint server to monitor print progress. The
                    Octoprint server must have the CORS setting disabled and
                    must be reachable from the client runnig this web
                    application in the browser.
                  </p>
                </StyledCallout>
                <TextField
                  label="Name"
                  name="name"
                  disabled={!currentState.matches("idle")}
                />
                <TextField
                  label="Hostname or IP address"
                  name="hostname"
                  disabled={!currentState.matches("idle")}
                />
                <TextField
                  label="Port"
                  name="port"
                  disabled={!currentState.matches("idle")}
                />
                <TextField
                  label="Username"
                  name="user"
                  disabled={!currentState.matches("idle")}
                />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  {currentState.matches("idle") && (
                    <>
                      <Button
                        type="submit"
                        intent="success"
                        disabled={isSubmitting}
                      >
                        Requestion authentication from Octoprint
                      </Button>
                      <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </>
                  )}
                  {currentState.matches("connecting") && (
                    <Callout intent="primary">
                      Connecting to Octoprint server
                    </Callout>
                  )}
                  {currentState.matches("polling_for_auth") && (
                    <Callout intent="primary">
                      Waiting for authorization. Open Octoprint and approve the
                      authorization request to continue.
                    </Callout>
                  )}
                  {currentState.matches("auth_successful") && (
                    <Callout intent="success">
                      Successfully added Octoprint server.
                    </Callout>
                  )}
                  {currentState.matches("auth_failed") && (
                    <Callout intent="danger">Authorization was denied.</Callout>
                  )}
                </div>
              </div>
            </Form>
          )}
        />
      </Dialog>
    </>
  );
});
export default OctoprintAddDialog;

const StyledDangerCallout = styled(Callout)`
  margin-top: 5px;
`;

const CustomInputComponent = ({
  field // { name, value, onChange, onBlur }
}: FieldProps) => (
  <>
    <InputGroup type="text" {...field} />
    <ErrorMessage name={field.name}>
      {error => (
        <StyledDangerCallout intent="danger" className="error">
          {error}
        </StyledDangerCallout>
      )}
    </ErrorMessage>
  </>
);

const TextField = ({
  label,
  name,
  disabled
}: {
  label: string;
  name: string;
  disabled?: boolean;
}) => (
  <FormGroup label={label} labelFor={`${name}-input`}>
    <Field
      id={`${name}-input`}
      name={name}
      component={CustomInputComponent}
      disabled={disabled}
    />
  </FormGroup>
);
