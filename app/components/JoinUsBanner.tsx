import { motion } from "framer-motion";
import { Link } from "react-router";
import { styles } from "../styles";

export function JoinUsBanner() {
  const joinUsText = "Join us →";
    return  <Link to="/booking" className={styles.classes.joinBanner} aria-label="Book a class">
          <motion.div
            className={styles.classes.joinTrack}
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 15,
              repeat: Infinity,
            }}
          >
            <div className={styles.classes.joinGroup}>
              {[...Array(10)].map((_, i) => (
                <span key={i}>{joinUsText}</span>
              ))}
            </div>
            <div className={styles.classes.joinGroup}>
              {[...Array(10)].map((_, i) => (
                <span key={`dup-${i}`}>{joinUsText}</span>
              ))}
            </div>
          </motion.div>
        </Link>;

}