// Mock of POST /groups/:code/join (see docs/API.md) until the frontend talks to the real backend.

export type JoinResult =
  | { ok: true; groupId: string; memberId: string }
  | { ok: false; error: "GROUP_NOT_FOUND" | "GROUP_CLOSED" | "NICKNAME_TAKEN" };

/** Only this code "exists" in the mock, so you can try both the success and the "not found" paths. */
export const MOCK_VALID_CODE = "1234";

export async function joinGroup(code: string, _nickname: string): Promise<JoinResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (code !== MOCK_VALID_CODE) return { ok: false, error: "GROUP_NOT_FOUND" };
  return { ok: true, groupId: "g_mock0001", memberId: "m_mock0001" };
}
