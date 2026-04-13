import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { InstructionsTab } from "./components/InstructionsTab";
import { MembersTab } from "./components/MembersTab";
import { SettingsTab } from "./components/SettingsTab";
import { SettlementsTab } from "./components/SettlementsTab";
import { TabNav } from "./components/TabNav";
import { Toast } from "./components/Toast";
import { createId } from "./lib/id";
import { generatePaymentInstructions } from "./lib/instructions";
import {
  clearAllAppData,
  loadAppState,
  resetToSampleData,
  saveMembers,
  saveSettlements,
} from "./lib/storage";
import { sampleMembers, sampleSettlements } from "./sampleData";
import type { Member, Settlement, TabKey } from "./types";

function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>("members");
  const [{ members, settlements }, setAppState] = useState(loadAppState);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingSettlementId, setEditingSettlementId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveSettlements(settlements);
  }, [settlements]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const instructions = useMemo(
    () => generatePaymentInstructions(members, settlements),
    [members, settlements],
  );

  const showToast = (message: string) => setToastMessage(message);

  const handleCopy = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch {
      showToast("コピーに失敗しました。");
    }
  };

  const replaceState = (nextMembers: Member[], nextSettlements: Settlement[]) => {
    setAppState({
      members: nextMembers,
      settlements: nextSettlements,
    });
    setEditingMemberId(null);
    setEditingSettlementId(null);
  };

  const handleMemberSubmit = (values: Omit<Member, "id">) => {
    setAppState((current) => {
      if (editingMemberId) {
        return {
          ...current,
          members: current.members.map((member) =>
            member.id === editingMemberId ? { ...member, ...values } : member,
          ),
        };
      }

      return {
        ...current,
        members: [...current.members, { id: createId(), ...values }],
      };
    });

    showToast(editingMemberId ? "メンバーを更新しました。" : "メンバーを追加しました。");
    setEditingMemberId(null);
  };

  const handleMemberDelete = (memberId: string) => {
    setAppState((current) => ({
      members: current.members.filter((member) => member.id !== memberId),
      settlements: current.settlements.filter(
        (settlement) =>
          settlement.fromMemberId !== memberId && settlement.toMemberId !== memberId,
      ),
    }));
    setEditingMemberId((current) => (current === memberId ? null : current));
    showToast("メンバーを削除しました。関連する清算結果も削除しました。");
  };

  const handleSettlementSubmit = (values: Omit<Settlement, "id">) => {
    setAppState((current) => {
      if (editingSettlementId) {
        return {
          ...current,
          settlements: current.settlements.map((settlement) =>
            settlement.id === editingSettlementId
              ? { ...settlement, ...values }
              : settlement,
          ),
        };
      }

      return {
        ...current,
        settlements: [...current.settlements, { id: createId(), ...values }],
      };
    });

    showToast(editingSettlementId ? "清算結果を更新しました。" : "清算結果を追加しました。");
    setEditingSettlementId(null);
  };

  const handleSettlementDelete = (settlementId: string) => {
    setAppState((current) => ({
      ...current,
      settlements: current.settlements.filter(
        (settlement) => settlement.id !== settlementId,
      ),
    }));
    setEditingSettlementId((current) => (current === settlementId ? null : current));
    showToast("清算結果を削除しました。");
  };

  const handleResetSamples = () => {
    resetToSampleData();
    replaceState(sampleMembers, sampleSettlements);
    showToast("サンプルデータを再投入しました。");
  };

  const handleClearAll = () => {
    clearAllAppData();
    replaceState([], []);
    showToast("保存データを削除しました。");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header currentTab={currentTab} />
        <TabNav currentTab={currentTab} onChange={setCurrentTab} />

        {currentTab === "members" && (
          <MembersTab
            members={members}
            editingMemberId={editingMemberId}
            onEdit={setEditingMemberId}
            onDelete={handleMemberDelete}
            onSubmit={handleMemberSubmit}
            onCancelEdit={() => setEditingMemberId(null)}
          />
        )}

        {currentTab === "settlements" && (
          <SettlementsTab
            members={members}
            settlements={settlements}
            editingSettlementId={editingSettlementId}
            onEdit={setEditingSettlementId}
            onDelete={handleSettlementDelete}
            onSubmit={handleSettlementSubmit}
            onCancelEdit={() => setEditingSettlementId(null)}
          />
        )}

        {currentTab === "instructions" && (
          <InstructionsTab
            members={members}
            instructions={instructions}
            onCopy={handleCopy}
          />
        )}

        {currentTab === "settings" && (
          <SettingsTab
            onResetSamples={handleResetSamples}
            onClearAll={handleClearAll}
          />
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
