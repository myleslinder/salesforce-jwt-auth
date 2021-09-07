import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { URL } from "url";
import { AuthInstance, Config } from "./types";
import { unknownErrorToObject } from "./utils";
import diagnosticMessages from "./diagnosticMessages";

export default async function salesforceAuth({
  connectedAppKey,
  username,
  privateKey,
  isSandbox = false,
  jwtExpiry: exp = "2h",
}: Config): Promise<AuthInstance> {
  const loginUrl = `https://${isSandbox ? "test" : "login"}.salesforce.com`;
  const jwtParams = {
    iss: connectedAppKey,
    prn: username,
    aud: loginUrl,
    exp,
  };

  const token = jwt.sign(jwtParams, privateKey, {
    algorithm: "RS256",
  });

  const tokenUrl = new URL("/services/oauth2/token", loginUrl);
  tokenUrl.searchParams.append(
    "grant_type",
    "urn:ietf:params:oauth:grant-type:jwt-bearer"
  );
  tokenUrl.searchParams.append("assertion", token);

  return await establishAuthInstance(tokenUrl);
}

async function establishAuthInstance(tokenUrl: URL): Promise<AuthInstance> {
  try {
    const res = await fetch(tokenUrl.toString(), {
      method: "POST",
    });
    if (!res.ok || res.status < 200 || res.status > 299) {
      !!diagnosticMessages[res.status] &&
        console.error(diagnosticMessages[res.status]);
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    const authInstance: AuthInstance = json as AuthInstance;
    return authInstance;
  } catch (e: unknown) {
    console.log(`Error in request: ${unknownErrorToObject(e).message}`);
    return Promise.reject(e);
  }
}

//import { request } from "https";
// function fetch(url: string | URL) {
//   return new Promise((resolve, reject) => {
//     const req = request(url, {}, (response) => {
//       if (
//         response.statusCode &&
//         (response.statusCode < 200 || response.statusCode > 299)
//       ) {
//         reject(
//           new Error(`Failed to load page, status code: ${response.statusCode}`)
//         );
//       }
//       const body: unknown[] = [];
//       response.on("data", (chunk) => body.push(chunk));
//       response.on("end", () => resolve(body.join("")));
//       if (response.statusCode === 200) {
//         resolve(response);
//       }
//     });
//     req.on("error", reject);
//   });
// }

/**
 * const fetcher =
  typeof global.fetch !== undefined
    ? global.fetch
    : (await import("node-fetch")).default;

 */
