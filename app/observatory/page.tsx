import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Observatory',
  description:
    'Live equation-of-time calculator — the difference between mean solar time and apparent solar time, computed in real time.',
};

export default function ObservatoryPage() {
  return (
    <div>
      {/* Hero — navy */}
      <div className={`${styles.hero}`}>
        <div className="container">
          <div className="eyebrow on-navy">Live Calculation</div>
          <h1 className={styles.h1}>The Equation of Time</h1>
          <p className={styles.lede}>
            The difference between mean solar time — the even, abstract time of clocks — and
            apparent solar time — the time read from a sundial — expressed in minutes and seconds.
            This is the quantity that Patek Philippe&rsquo;s equation-of-time complications were
            made to display.
          </p>

          {/* Live widget will be implemented in Milestone 4 */}
          <div className={styles.widgetPlaceholder}>
            <div className={styles.placeholderLabel}>Live Observatory Widget</div>
            <div className={styles.placeholderSub}>
              SVG curve, pulsing gold marker, and 4-column live readout will be
              implemented in Milestone 4
            </div>
          </div>
        </div>
      </div>

      {/* Explainer sections */}
      <div className="section">
        <div className="container">
          <div className={styles.explainer}>
            <div>
              <div className="eyebrow">The Formula</div>
              <h2 className={styles.explainerH}>Spencer&rsquo;s Approximation</h2>
              <p>
                The equation of time is computed using the Spencer (1971) formula, accurate to
                approximately ±30 seconds. Let <em>N</em> be the day of the year (1 = 1 January)
                and <em>B = 2π(N − 81) / 365</em>. Then:
              </p>
              <div className={styles.formula}>
                EoT = 9.87 sin(2B) − 7.53 cos(B) − 1.5 sin(B) minutes
              </div>
              <p>
                Positive values mean the sun runs fast — a sundial is ahead of the clock. Negative
                values mean the sun runs slow — the clock is ahead of the sundial.
              </p>
            </div>
            <div>
              <div className="eyebrow">Why It Varies</div>
              <h2 className={styles.explainerH}>Two Sources of Discrepancy</h2>
              <p>
                The equation of time arises from two separate effects: the ellipticity of
                Earth&rsquo;s orbit (the planet moves faster near perihelion in January than near
                aphelion in July), and the obliquity of the ecliptic (the axial tilt means the
                sun&rsquo;s apparent motion along the ecliptic does not translate uniformly into
                motion along the celestial equator).
              </p>
              <p>
                The combined effect produces four near-zero crossings per year, with extremes of
                approximately +16 minutes (early November) and −14 minutes (mid-February).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
