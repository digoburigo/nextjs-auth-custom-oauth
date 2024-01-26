import type { JWT } from "@auth/core/jwt";
import type { DefaultSession, Profile } from "next-auth";
import type { OIDCConfig } from "next-auth/providers";
import NextAuth from "next-auth";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    {
      id: "foo",
      name: "foo",
      type: "oidc",
      wellKnown: `http://localhost:3002/.well-known/openid-configuration/`,
      issuer: `http://localhost:3002`,
      userinfo: `http://localhost:3002/userinfo/`,
      jwks_endpoint: `http://localhost:3002/.well-known/jwks.json`,
      token: `http://localhost:3002/token/`,
      authorization: {
        url: `http://localhost:3002/authorize/`,
        params: { scope: "openid profile email" },
      },
      profile(profile, tokens) {
        console.log(`tokens:`, tokens);
        console.log(`profile:`, profile);
        return profile;
      },
      clientId: "foo",
      clientSecret: "bar",
    } satisfies OIDCConfig<Profile>,
  ],
  callbacks: {
    session: (opts) => {
      if (!("user" in opts)) throw "unreachable with session strategy";

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
    async jwt({ account, token, user, trigger, profile, session }) {
      console.log("Time: ", Date.now());

      // Initial login
      if (account) {
        console.log(`account:`, account);
        console.log("LOGIN INICIAL");

        return {
          access_token: account.access_token,
          expires_at: Math.round(Date.now() / 1000 + account.expires_in!),
          refresh_token: account.refresh_token,
          uid: user?.id,
          id: profile?.sub,
          name: profile?.name,
          email: profile?.email,
        };
      }

      console.log(`current token:`, token);

      // Return previous token if the access token has not expired yet
      if (Math.round(Date.now() / 1000) < token.expires_at) {
        console.log(`session:`, session);
        console.log(`trigger:`, trigger);

        if (trigger === "update" && session.organization) {
          token.organization = session.organization;
        }

        return token;
      }

      console.log("EXPIROU ACCESS TOKEN");
      console.log(`Date.now():`, Math.round(Date.now() / 1000));
      console.log(`token.expires_at:`, token.expires_at);
      console.log("compare", Math.round(Date.now() / 1000) > token.expires_at);
      console.log("REFRESHING TOKEN");

      // Access token has expired, try to update it
      const refreshedTokens = await refreshAccessToken(token);

      return refreshedTokens;
    },
  },
});
/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_id: process.env.DJANGO_OAUTH_CLIENT_ID!,
      client_secret: process.env.DJANGO_OAUTH_CLIENT_SECRET!,
    });

    const response = await fetch(`${process.env.DJANGO_OAUTH_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newTokens: JWT = {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.round(Date.now() / 1000 + refreshedTokens.expires_in),
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
    };

    console.log(`newTokens:`, newTokens);

    return newTokens;
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    expires_at: number;
    refresh_token: string;
    organization?: string;
  }
}
