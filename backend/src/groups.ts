import { randomBytes } from "node:crypto";

export interface Member {
  id: string;
  nickname: string;
}

export interface Filters {
  radiusMeters?: number;
  price?: number[];
  cuisine?: string[];
}

export interface Group {
  id: string;
  joinCode: string;
  location: { lat: number; lng: number };
  filters: Filters;
  members: Member[];
  createdAt: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// No 0/O/1/I so codes are easy to read out loud
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const GROUP_TTL_MS = Number(process.env.GROUP_TTL_HOURS ?? 24) * 60 * 60 * 1000;

// In memory for now; swap for the database later without changing the API
const groupsByCode = new Map<string, Group>();
const groupsById = new Map<string, Group>();

export function findGroupForMember(groupId: string, memberId: string): Group | undefined {
  const group = groupsById.get(groupId);
  if (!group || isExpired(group)) return undefined;
  return group.members.some((m) => m.id === memberId) ? group : undefined;
}

function newId(prefix: string): string {
  return `${prefix}_${randomBytes(4).toString("hex")}`;
}

function newJoinCode(): string {
  for (;;) {
    let code = "";
    for (const byte of randomBytes(CODE_LENGTH)) {
      code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
    }
    if (!groupsByCode.has(code)) return code;
  }
}

function isExpired(group: Group): boolean {
  return Date.now() - group.createdAt > GROUP_TTL_MS;
}

export function createGroup(input: {
  nickname: string;
  location: { lat: number; lng: number };
  filters: Filters;
}) {
  const host: Member = { id: newId("m"), nickname: input.nickname };
  const group: Group = {
    id: newId("g"),
    joinCode: newJoinCode(),
    location: input.location,
    filters: input.filters,
    members: [host],
    createdAt: Date.now(),
  };
  groupsByCode.set(group.joinCode, group);
  groupsById.set(group.id, group);
  return { groupId: group.id, joinCode: group.joinCode, memberId: host.id };
}

export function joinGroup(joinCode: string, nickname: string) {
  const group = groupsByCode.get(joinCode.toUpperCase());
  if (!group) {
    throw new ApiError(404, "GROUP_NOT_FOUND", "That code doesn't match an open group.");
  }
  if (isExpired(group)) {
    throw new ApiError(410, "GROUP_CLOSED", "That group has closed. Start a new one.");
  }
  const taken = group.members.some(
    (m) => m.nickname.toLowerCase() === nickname.toLowerCase(),
  );
  if (taken) {
    throw new ApiError(409, "NICKNAME_TAKEN", "Someone in the group already has that nickname.");
  }
  const member: Member = { id: newId("m"), nickname };
  group.members.push(member);
  return { groupId: group.id, memberId: member.id, members: group.members };
}
