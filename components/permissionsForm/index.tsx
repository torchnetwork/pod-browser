/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable camelcase */
import { Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { unstable_Access } from "@solid/lit-pod";
import { MenuItem, Select } from "@material-ui/core";
import { AlertProps } from "@material-ui/lab/Alert";
import AlertContext from "../../src/contexts/alertContext";
import ConfirmationDialogContext from "../../src/contexts/confirmationDialogContext";
import {
  NormalizedPermission,
  ACCESS_MODES,
  displayPermissions,
  IResponse,
  aclForAlias,
} from "../../src/lit-solid-helpers";

interface ISavePermissionHandler {
  access: unstable_Access;
  setMessage: Dispatch<string>;
  setSeverity: Dispatch<AlertProps["severity"]>;
  setDialogOpen: Dispatch<boolean>;
  setAlertOpen: Dispatch<boolean>;
  onSave: (access: unstable_Access) => Promise<IResponse>;
}

export function savePermissionsHandler({
  access,
  onSave,
  setAlertOpen,
  setDialogOpen,
  setMessage,
  setSeverity,
}: ISavePermissionHandler): () => void {
  return async (): Promise<void> => {
    const { response, error } = await onSave(access);

    if (response) {
      setDialogOpen(false);
      setMessage("Your permissions have been saved!");
      setAlertOpen(true);
    } else {
      setDialogOpen(false);
      setSeverity("error" as AlertProps["severity"]);
      setMessage(error as string);
      setAlertOpen(true);
    }
  };
}

export function accessSelectOptions(): ReactElement[] {
  return Object.values(ACCESS_MODES).map(({ alias }, i) => (
    <MenuItem key={i} value={alias}>
      {alias}
    </MenuItem>
  ));
}

interface ISaveHandler {
  setSelectedAccess: Dispatch<string>;
  setAccess: Dispatch<unstable_Access>;
  setDialogOpen: Dispatch<boolean>;
  warnOnSubmit: boolean;
  savePermissions: () => void;
}

export function changeHandler({
  savePermissions,
  setAccess,
  setDialogOpen,
  setSelectedAccess,
  warnOnSubmit,
}: ISaveHandler) {
  return async ({ target }: React.ChangeEvent): void => {
    const element = target as HTMLInputElement;
    const value = element.value as string;
    const access = aclForAlias(value);

    if (access) setAccess(access);
    if (value) setSelectedAccess(value);

    if (warnOnSubmit) {
      setDialogOpen(true);
    } else {
      await savePermissions();
    }
  };
}

interface IPermissionForm {
  permission: Partial<NormalizedPermission>;
  warnOnSubmit: boolean;
  onSave: (access: unstable_Access) => Promise<IResponse>;
}

export default function PermissionsForm({
  permission,
  warnOnSubmit,
  onSave,
}: IPermissionForm): ReactElement | null {
  const { acl } = permission;

  const [access, setAccess] = useState(acl as unstable_Access);
  const [selectedAccess, setSelectedAccess] = useState(
    displayPermissions(access)
  );
  const { setMessage, setSeverity, setAlertOpen } = useContext(AlertContext);
  const [confirmationSetup, setConfirmationSetup] = useState(false);
  const { setTitle, setOpen, setContent, confirmed, setConfirmed } = useContext(
    ConfirmationDialogContext
  );
  const savePermissions = savePermissionsHandler({
    access,
    onSave,
    setAlertOpen,
    setDialogOpen: setOpen,
    setMessage,
    setSeverity,
  });

  const handleChange = changeHandler({
    savePermissions,
    setAccess,
    setDialogOpen: setOpen,
    setSelectedAccess,
    warnOnSubmit,
  });

  useEffect(() => {
    if (confirmationSetup && !confirmed) return;

    setTitle("Confirm Access Permissions");
    setContent(
      <p>
        You are about to change your own access to this resource, are you sure
        you wish to continue?
      </p>
    );
    setConfirmationSetup(true);

    if (confirmed) {
      setOpen(false);
      setConfirmed(false);
      savePermissions();
    }
  }, [
    confirmationSetup,
    confirmed,
    savePermissions,
    setConfirmationSetup,
    setConfirmed,
    setContent,
    setOpen,
    setTitle,
  ]);

  return (
    <section>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedAccess}
        onChange={handleChange}
      >
        {accessSelectOptions()}
      </Select>
    </section>
  );
}
