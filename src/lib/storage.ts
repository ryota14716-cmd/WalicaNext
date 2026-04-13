import { sampleMembers, sampleSettlements } from "../sampleData";
import type { Member, Settlement } from "../types";

const MEMBERS_KEY = "walica-transfer-tool.members";
const SETTLEMENTS_KEY = "walica-transfer-tool.settlements";
const BOOTSTRAPPED_KEY = "walica-transfer-tool.bootstrapped";

type AppState = {
  members: Member[];
  settlements: Settlement[];
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadAppState = (): AppState => {
  if (typeof window === "undefined") {
    return {
      members: sampleMembers,
      settlements: sampleSettlements,
    };
  }

  const hasBootstrapped = window.localStorage.getItem(BOOTSTRAPPED_KEY);

  if (!hasBootstrapped) {
    window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(sampleMembers));
    window.localStorage.setItem(SETTLEMENTS_KEY, JSON.stringify(sampleSettlements));
    window.localStorage.setItem(BOOTSTRAPPED_KEY, "true");

    return {
      members: sampleMembers,
      settlements: sampleSettlements,
    };
  }

  return {
    members: safeParse<Member[]>(window.localStorage.getItem(MEMBERS_KEY), []),
    settlements: safeParse<Settlement[]>(
      window.localStorage.getItem(SETTLEMENTS_KEY),
      [],
    ),
  };
};

export const saveMembers = (members: Member[]) => {
  window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

export const saveSettlements = (settlements: Settlement[]) => {
  window.localStorage.setItem(SETTLEMENTS_KEY, JSON.stringify(settlements));
};

export const resetToSampleData = () => {
  saveMembers(sampleMembers);
  saveSettlements(sampleSettlements);
  window.localStorage.setItem(BOOTSTRAPPED_KEY, "true");
};

export const clearAllAppData = () => {
  window.localStorage.removeItem(MEMBERS_KEY);
  window.localStorage.removeItem(SETTLEMENTS_KEY);
  window.localStorage.removeItem(BOOTSTRAPPED_KEY);
};
