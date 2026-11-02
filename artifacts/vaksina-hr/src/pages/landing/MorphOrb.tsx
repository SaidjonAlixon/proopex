import { motion, useReducedMotion } from 'framer-motion';

/** Dumaloq orb — doimiy shakl almashinuvi (blob → yumaloq → kvadrat → romb…) */
export function MorphOrb({
  src,
  alt = 'PROOPEX',
  size = 'lg',
}: {
  src: string;
  alt?: string;
  size?: 'md' | 'lg' | 'xl';
}) {
  const reduce = useReducedMotion();

  return (
    <div className={`landing-morph landing-morph--${size}`} aria-hidden={false}>
      <div className="landing-morph-glow" aria-hidden />
      <div className="landing-morph-grid" aria-hidden />

      {!reduce ? (
        <>
          <motion.div
            className="landing-morph-blob landing-morph-blob--a"
            animate={{
              borderRadius: [
                '60% 40% 30% 70% / 60% 30% 70% 40%',
                '30% 60% 70% 40% / 50% 60% 30% 60%',
                '50% 50% 50% 50% / 50% 50% 50% 50%',
                '40% 60% 35% 65% / 55% 45% 55% 45%',
                '55% 45% 60% 40% / 35% 65% 35% 65%',
                '42% 58% 48% 52% / 48% 42% 58% 52%',
                '60% 40% 30% 70% / 60% 30% 70% 40%',
              ],
              rotate: [0, 12, -8, 18, -6, 10, 0],
              scale: [1, 1.04, 0.98, 1.06, 1, 1.03, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="landing-morph-blob landing-morph-blob--b"
            animate={{
              borderRadius: [
                '40% 60% 70% 30% / 40% 50% 60% 50%',
                '55% 45% 40% 60% / 55% 40% 60% 45%',
                '35% 65% 55% 45% / 45% 55% 40% 60%',
                '50% 50% 20% 80% / 25% 75% 50% 50%',
                '65% 35% 50% 50% / 60% 40% 55% 45%',
                '40% 60% 70% 30% / 40% 50% 60% 50%',
              ],
              rotate: [0, -16, 10, -20, 8, -12, 0],
              scale: [1.05, 1, 1.08, 0.96, 1.04, 1.02, 1.05],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <motion.div
            className="landing-morph-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="landing-morph-ring landing-morph-ring--rev"
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          />
        </>
      ) : (
        <div className="landing-morph-blob landing-morph-blob--a landing-morph-blob--static" />
      )}

      <motion.img
        src={src}
        alt={alt}
        className="landing-morph-logo"
        width={200}
        height={200}
        animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
