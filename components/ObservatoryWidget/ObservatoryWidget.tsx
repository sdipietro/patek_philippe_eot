'use client';

import { useState, useEffect } from 'react';
import { equationOfTime, formatEoT, dayOfYear, buildEoTCurvePoints } from '@/lib/eot';
import styles from './ObservatoryWidget.module.css';

const W = 800;
const H = 320;
const PAD = 48;
const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const { points, zeroY } = buildEoTCurvePoints(W, H, PAD);
const innerW = W - PAD * 2;

const pathD = points
  .map(([x, y], i) => (i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`))
  .join(' ');

// Y-axis ticks
const Y_TICKS = [-15, -10, -5, 0, 5, 10, 15];
const tickY = (v: number) => PAD + ((18 - v) / 36) * (H - PAD * 2);

// Month label x positions (computed once)
const MONTH_X = MONTH_LABELS.map((_, i) => {
  const doy = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335][i];
  return PAD + (doy - 1) * (innerW / 364);
});

type Props = { compact?: boolean };

export default function ObservatoryWidget({ compact = false }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className={styles.skeleton} />;

  const { eot } = equationOfTime(now);
  const N = dayOfYear(now);
  const markerX = PAD + (N - 1) * (innerW / 364);
  const markerY = PAD + ((18 - eot) / 36) * (H - PAD * 2);

  const localHMS = (ms: number) => {
    const d = new Date(ms);
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
  };

  const meanMs = now.getTime();
  const apparentMs = meanMs + eot * 60_000;
  const todayLabel = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={`${styles.widget} ${compact ? styles.compact : ''}`}>
      {/* SVG curve */}
      <div className={styles.curveWrap}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          aria-label="Annual equation of time curve"
          role="img"
        >
          <defs>
            <linearGradient id="obs-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a973" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c9a973" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Zero line */}
          <line
            x1={PAD} x2={W - PAD} y1={zeroY} y2={zeroY}
            stroke="rgba(245,240,225,0.18)" strokeWidth="0.6" strokeDasharray="3 5"
          />

          {/* Y-axis ticks */}
          {Y_TICKS.map((v) => {
            const y = tickY(v);
            return (
              <g key={v}>
                <line x1={PAD - 5} x2={PAD} y1={y} y2={y} stroke="rgba(245,240,225,0.28)" strokeWidth="0.6" />
                <text x={PAD - 9} y={y + 3.5} textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="rgba(245,240,225,0.50)">
                  {v > 0 ? `+${v}` : v}
                </text>
              </g>
            );
          })}

          {/* Month labels */}
          {MONTH_LABELS.map((m, i) => (
            <g key={m}>
              <line x1={MONTH_X[i]} x2={MONTH_X[i]} y1={H - PAD} y2={H - PAD + 4} stroke="rgba(245,240,225,0.22)" strokeWidth="0.6" />
              <text x={MONTH_X[i]} y={H - PAD + 17} textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="2" fill="rgba(245,240,225,0.50)">
                {m}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={16} y={PAD + 6} fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="2" fill="rgba(245,240,225,0.45)">MINUTES</text>

          {/* Filled area */}
          <path d={`${pathD} L ${W - PAD} ${zeroY} L ${PAD} ${zeroY} Z`} fill="url(#obs-fill)" opacity="0.22" />

          {/* Main curve */}
          <path d={pathD} stroke="var(--gold-400)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

          {/* Today's vertical guide */}
          <line
            x1={markerX} x2={markerX}
            y1={PAD} y2={H - PAD}
            stroke="var(--gold-400)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5"
          />

          {/* Pulsing ring */}
          <circle cx={markerX} cy={markerY} r="11" fill="none" stroke="var(--gold-400)" strokeWidth="0.7" opacity="0.5" className={styles.pulse} />

          {/* Marker dot */}
          <circle cx={markerX} cy={markerY} r="5.5" fill="var(--gold-400)" stroke="var(--navy-900)" strokeWidth="2" />
        </svg>
      </div>

      {/* Readout row */}
      <div className={styles.readout}>
        <div className={styles.readoutCol}>
          <div className={styles.label}>Today</div>
          <div className={styles.date}>{todayLabel}</div>
        </div>
        <div className={styles.readoutCol}>
          <div className={styles.label}>Mean solar time</div>
          <div className={`${styles.time} ${styles.mono}`}>{localHMS(meanMs)}</div>
          <div className={styles.sub}>Civil clock</div>
        </div>
        <div className={`${styles.readoutCol} ${styles.readoutKey}`}>
          <div className={styles.label}>Apparent solar time</div>
          <div className={`${styles.time} ${styles.mono}`}>{localHMS(apparentMs)}</div>
          <div className={styles.sub}>Sundial</div>
        </div>
        <div className={styles.readoutCol}>
          <div className={styles.label}>Equation of Time</div>
          <div className={`${styles.eot} ${styles.mono}`}>{formatEoT(eot)}</div>
          <div className={styles.sub}>
            {eot >= 0 ? 'Sundial ahead of clock' : 'Sundial behind clock'}
          </div>
        </div>
      </div>
    </div>
  );
}
