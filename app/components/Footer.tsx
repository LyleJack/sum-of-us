import { styles } from "../styles";
import { Link } from "react-router";
import bigLogo from "../images/big-logo.svg";
import instaLogo from "../images/instagramLogo.svg";
import facebookLogo from "../images/facebookLogo.svg";

export default function Footer() {
    return (
         <footer className={styles.footer.footer}>
          <div className={styles.footer.content}>
            {/*<div className={styles.footer.venue}>
              <p>Tuesdays &amp; Thursdays @ 7pm</p>
              <p>Venue TBC</p>
              <Link to="https://maps.app.goo.gl/gN7gxPzevTS3mrC57" target="_blank" rel="noopener noreferrer">
                Show in maps
              </Link>
            </div>*/}
            <nav className={styles.footer.links} aria-label="Footer">
              <div className={styles.footer.social}>

                <p>Connect with us</p>
              <div>
                <Link to="https://www.facebook.com/people/Sum-of-Us/61592887089682/" aria-label="Facebook"  target="_blank" rel="noopener noreferrer">
                  <img src={facebookLogo} alt="Facebook" />
                </Link>
                <Link to="https://www.instagram.com/sum.of.us.selfdefence" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <img src={instaLogo} alt="Instagram" />
                </Link>
              </div>
              </div>
            </nav>
          </div>
          <img src={bigLogo} alt="Sum of Us" className={styles.footer.logo} />
        </footer>
    )
}
