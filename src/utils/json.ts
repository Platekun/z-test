import fetch from "cross-fetch";

export async function json<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  if (res.ok) {
    return await res.json();
  }

  throw new Error(JSON.stringify(await res.json(), null, 2));
}
