"use client";

import { useEffect, useMemo, useState } from "react";
import { runAuditWorkflow } from "@/lib/agents/orchestrator";
import { defaultAuditId, demoAudits } from "@/lib/data/demoAudit";
import type { AuditRun, AuditSampleId } from "@/lib/types";

const storageKey = "kintsugiguard:selected-audit";

function isAuditSampleId(value: string | null): value is AuditSampleId {
  return demoAudits.some((audit) => audit.id === value);
}

export function useAuditRun(): {
  auditId: AuditSampleId;
  run: AuditRun;
  selectAudit: (auditId: AuditSampleId) => void;
} {
  const [auditId, setAuditId] = useState<AuditSampleId>(defaultAuditId);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (isAuditSampleId(stored)) {
        setAuditId(stored);
      }
    } catch {
      setAuditId(defaultAuditId);
    }
  }, []);

  const selectAudit = (nextAuditId: AuditSampleId) => {
    setAuditId(nextAuditId);
    try {
      window.localStorage.setItem(storageKey, nextAuditId);
    } catch {
      // The selected audit still updates in memory when storage is unavailable.
    }
  };

  const run = useMemo(() => runAuditWorkflow(auditId), [auditId]);

  return { auditId, run, selectAudit };
}
