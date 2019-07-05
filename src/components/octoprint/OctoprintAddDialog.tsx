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
    .required("Required")
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
        CONNECTION_SUCCESS: "waiting_for_auth",
        CONNECTION_FAILURE: "connection_failed"
      }
    },
    waiting_for_auth: {
      on: {
        TIMER: "polling_for_auth"
      }
    },
    polling_for_auth: {
      on: {
        AUTH_REQUEST_ACCEPTED: "auth_successful",
        AUTH_REQUEST_DENIED: "auth_failed",
        RETRY: "waiting_for_auth"
      }
    },
    connection_failed: {
      on: {
        CONNECT: "connecting"
      }
    },
    auth_successful: {
      type: "final"
    },
    auth_failed: {
      on: {
        CONNECT: "connecting"
      }
    }
  }
});

const OctoprintAddDialog = observer(() => {
  const [isOpen, setOpen] = useState(false);

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
        onClose={() => setOpen(false)}
      >
        <Formik
          initialValues={{
            name: "",
            hostname: "",
            port: "80",
            apikey: ""
          }}
          onSubmit={values => {
            OctoprintStore.addServer(values);
            setOpen(false);
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
                <TextField label="Name" name="name" />
                <TextField label="Hostname or IP address" name="hostname" />
                <TextField label="Port" name="port" />
                <TextField label="API Key" name="apikey" />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button
                    type="submit"
                    intent="success"
                    disabled={isSubmitting}
                  >
                    Add Octoprint server
                  </Button>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
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

const TextField = ({ label, name }: { label: string; name: string }) => (
  <FormGroup label={label} labelFor={`${name}-input`}>
    <Field id={`${name}-input`} name={name} component={CustomInputComponent} />
  </FormGroup>
);
