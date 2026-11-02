/**
 * VNOI / Codeforces Rating & Rank Designation System
 * Translates competitive programming Elo ratings into official VNOI rank titles and color classes.
 */

export interface VnoiRankInfo {
  title: string;
  textColor: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
}

export function getVnoiRankInfo(rating: number = 1200): VnoiRankInfo {
  if (rating >= 2400) {
    return {
      title: 'Grandmaster',
      textColor: 'text-rose-600 dark:text-rose-400 font-bold',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      borderColor: 'border-rose-300 dark:border-rose-800',
      dotColor: 'bg-rose-500'
    };
  }
  if (rating >= 2200) {
    return {
      title: 'Master',
      textColor: 'text-amber-600 dark:text-amber-400 font-bold',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      borderColor: 'border-amber-300 dark:border-amber-800',
      dotColor: 'bg-amber-500'
    };
  }
  if (rating >= 1900) {
    return {
      title: 'Candidate Master',
      textColor: 'text-purple-600 dark:text-purple-400 font-semibold',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      borderColor: 'border-purple-300 dark:border-purple-800',
      dotColor: 'bg-purple-500'
    };
  }
  if (rating >= 1600) {
    return {
      title: 'Expert',
      textColor: 'text-blue-600 dark:text-blue-400 font-semibold',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      borderColor: 'border-blue-300 dark:border-blue-800',
      dotColor: 'bg-blue-500'
    };
  }
  if (rating >= 1400) {
    return {
      title: 'Specialist',
      textColor: 'text-cyan-600 dark:text-cyan-400 font-semibold',
      badgeBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
      borderColor: 'border-cyan-300 dark:border-cyan-800',
      dotColor: 'bg-cyan-500'
    };
  }
  if (rating >= 1200) {
    return {
      title: 'Pupil',
      textColor: 'text-emerald-600 dark:text-emerald-400 font-medium',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      borderColor: 'border-emerald-300 dark:border-emerald-800',
      dotColor: 'bg-emerald-500'
    };
  }
  return {
    title: 'Newbie',
    textColor: 'text-slate-500 dark:text-slate-400',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    borderColor: 'border-slate-300 dark:border-slate-700',
    dotColor: 'bg-slate-400'
  };
}
