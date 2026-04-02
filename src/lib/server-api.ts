const REMOTE_API_BASE_URL =
  process.env.REMOTE_API_BASE_URL || "https://nexlearn.noviindusdemosites.in";

export async function forwardRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = `${REMOTE_API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    cache: "no-store",
  });

  return response;
}