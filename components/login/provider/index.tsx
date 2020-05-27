import React, { ChangeEvent, useState, ReactElement } from "react";
import { Button, Select, MenuItem, Box, TextField } from "@material-ui/core";

import { login } from "../../../lib/solid-auth-fetcher/dist";

import getProviders from "../../../constants/provider";
import getConfig from "../../../constants/config";

const PROVIDERS = getProviders();
const CONFIG = getConfig();
const CUSTOM_PROVIDER = "other";

export const loginWithProvider = (provider: string): void => {
  login({
    oidcIssuer: provider,
    clientId: CONFIG.idpClientId,
    redirect: `${CONFIG.host}${CONFIG.loginRedirect}`,
  });
};

export default function Provider(): ReactElement {
  const [provider, setProvider] = useState(PROVIDERS[0].value);
  const [customProvider, setCustomProvider] = useState("");

  const handleFormSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    loginWithProvider(customProvider || provider);
  };

  // any is used on the select onchange due to ongoing debates about how to handle the event
  /* eslint @typescript-eslint/no-explicit-any: 0 */

  return (
    <form onSubmit={handleFormSubmit}>
      <Box my={2}>
        <Select
          value={provider}
          onChange={(e: any) => {
            setCustomProvider("");
            setProvider(e.target.value);
          }}
        >
          {PROVIDERS.map((p) => (
            <MenuItem value={p.value} key={p.value}>
              {p.label}
            </MenuItem>
          ))}

          <MenuItem value={CUSTOM_PROVIDER}>Other</MenuItem>
        </Select>

        {provider === CUSTOM_PROVIDER ? (
          <Box mt={2}>
            <TextField
              type="url"
              id="customProvider"
              placeholder="Provider IRI"
              value={customProvider}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCustomProvider(e.target.value);
              }}
            />
          </Box>
        ) : null}

        <Box mt={2}>
          <Button variant="contained" type="submit" color="primary">
            Log In
          </Button>
        </Box>
      </Box>
    </form>
  );
}
