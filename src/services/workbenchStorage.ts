import type { Verdict, LocalSubmissionRecord } from '../types/index.ts';

export type { LocalSubmissionRecord };

export interface LocalProblemNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export const DEFAULT_CODES: Record<string, string> = {
  c17: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>

int main() {
    return 0;
}`,
  cpp20: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    return 0;
}`,
  cpp17: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    return 0;
}`,
  py3: `import sys
import math

def solve():
    pass

if __name__ == '__main__':
    solve()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        
    }
}`,
  rust: `use std::io::{self, BufRead};

fn main() {
    
}`,
  sql: `-- Hệ quản trị cơ sở dữ liệu mẫu sẵn có: students, courses
SELECT id, name, major, gpa
FROM students
WHERE gpa >= 3.5
ORDER BY gpa DESC;`
};

export function getWorkbenchDraftKey(probId: string, lang: string): string {
  return `ahtest_draft_workbench_${probId}_${lang}`;
}

export function isLeakedWorkbenchDraft(probId: string, code: string): boolean {
  if (!code) return false;
  return (
    code.includes('// [Sanitized]') ||
    code.includes('Dynamically allocate') ||
    code.includes('min_odd') ||
    code.includes('max_odd') ||
    code.includes('veTamGiac') ||
    code.includes('PRF192 Master') ||
    (probId.startsWith('prf192_') &&
      (code.includes('void swap') || code.includes('scanf(') || code.length > 250))
  );
}

export function loadCleanWorkbenchDraft(
  probId: string,
  lang: string
): { code: string; saved: boolean } {
  const key = getWorkbenchDraftKey(probId, lang);
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (isLeakedWorkbenchDraft(probId, saved)) {
        localStorage.removeItem(key);
        return { code: DEFAULT_CODES[lang] || '', saved: false };
      }
      return { code: saved, saved: true };
    }
  } catch {
    // ignore
  }
  return { code: DEFAULT_CODES[lang] || '', saved: false };
}

export function loadLocalSubmissions(probId: string): LocalSubmissionRecord[] {
  try {
    const raw = localStorage.getItem(`ahtest_submissions_${probId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalSubmissions(probId?: string): LocalSubmissionRecord[] {
  if (probId) return loadLocalSubmissions(probId);
  const all: LocalSubmissionRecord[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ahtest_submissions_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) all.push(...parsed);
        }
      }
    }
  } catch {
    // ignore
  }
  return all;
}

export function saveLocalSubmission(
  probId: string,
  record: LocalSubmissionRecord
): LocalSubmissionRecord[] {
  const existing = loadLocalSubmissions(probId);
  const updated = [record, ...existing].slice(0, 20);
  try {
    localStorage.setItem(`ahtest_submissions_${probId}`, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function loadLocalNotes(probId: string): LocalProblemNote[] {
  try {
    const raw = localStorage.getItem(`ahtest_notes_${probId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalNotes(
  probId: string,
  notes: LocalProblemNote[]
): void {
  try {
    localStorage.setItem(`ahtest_notes_${probId}`, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export function getVerdictMeta(verdict: Verdict | null): {
  label: string;
  badgeClass: string;
  shortClass: string;
} {
  switch (verdict) {
    case 'AC':
      return {
        label: 'ACCEPTED (100/100)',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        shortClass: 'bg-emerald-500/20 text-emerald-400',
      };
    case 'WA':
      return {
        label: 'WRONG ANSWER',
        badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
        shortClass: 'bg-rose-500/20 text-rose-400',
      };
    case 'TLE':
      return {
        label: 'TIME LIMIT EXCEEDED',
        badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        shortClass: 'bg-amber-500/20 text-amber-400',
      };
    case 'MLE':
      return {
        label: 'MEMORY LIMIT EXCEEDED',
        badgeClass: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
        shortClass: 'bg-purple-500/20 text-purple-400',
      };
    case 'CE':
      return {
        label: 'COMPILE ERROR',
        badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
        shortClass: 'bg-yellow-500/20 text-yellow-400',
      };
    case 'RTE':
      return {
        label: 'RUNTIME ERROR',
        badgeClass: 'bg-red-500/20 text-red-400 border border-red-500/40',
        shortClass: 'bg-red-500/20 text-red-400',
      };
    default:
      return {
        label: 'CHƯA NỘP BÀI',
        badgeClass: 'bg-slate-800 text-slate-400 border border-slate-700',
        shortClass: 'bg-slate-800 text-slate-400',
      };
  }
}
