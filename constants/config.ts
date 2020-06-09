type ConfigEntity = {
  idpClientId: string;
  loginRedirect: string;
  host: string;
};

export default function getConfig(): ConfigEntity {
  return {
    idpClientId: process.env.NEXT_PUBLIC_IDP_CLIENT_ID || "",
    host: process.env.NEXT_PUBLIC_APP_HOST || "",
    loginRedirect: "/",
  };
}
