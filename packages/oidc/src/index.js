import cors from "cors";
import Provider from "oidc-provider";

const configuration = {
  // refer to the documentation for other available configuration
  clients: [
    {
      client_id: "foo",
      client_secret: "bar",
      redirect_uris: ["http://localhost:3000/api/auth/callback/foo"],
      // ... other client properties
    },
  ],
};

const oidc = new Provider("http://localhost:3002", configuration);
oidc.use(cors());

oidc.listen(3002, () => {
  console.log(
    "oidc-provider listening on port 3002, check http://localhost:3002/.well-known/openid-configuration",
  );
});
