import { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import Ryan from "../images/Ryan Sum of Us.jpg";
import Marios from "../images/Marios Sum of Us.jpeg";
import Anna from "../images/Anna Sum of Us.jpg";
import Karen from "../images/Karen Sum of Us.jpg";

type PersonCard = {
  name: string;
  role: string;
  bio: string;
  bioExt: string;
  image: string;
};

const peopleCards: PersonCard[] = [
  {
    name: "Marios",
    role: "Instructor",
    bio: "Marios has been training in various self defence systems and martial arts for over a decade now.",
    bioExt: "He is a software engineer by day who comes with all the expected introversion but learned to act like an extrovert very well to blend it. He likes to cook, bake, read, write, run and games in all forms.",
    image: Marios,
  },
  {
    name: "Ryan",
    role: "Instructor",
    bio: "Ryan has been training in various martial arts for over 20 years and has been instructing for more than 10. His favourite martial arts are Krav Maga and Brazilian Jujitsu.",
    bioExt: "Outside of martial arts, Ryan enjoys climbing, boardgames, long lie-ins and exploring local bakeries.",
    image: Ryan,
  },
  {
    name: "Anna",
    role: "Coordinator",
    bio: "Anna has her own brand design studio and helps build and grow Sum of Us in her spare time. She is passionate about helping people feel more confident and find their voice.",
    bioExt: "Her other interests include reading (as many novels as possible) and discovering the best coffee spots in Glasgow.",
    image: Anna,
  },
  {
    name: "Karen",
    role: "Trustee",
    bio: "Karen has worked and volunteered in the charity sector for over 8 years, working in her local communities to support groups from all walks of life",
    bioExt: "In her free time, Karen likes being in nature, reading fantasy novels and spending time with her cats.",
    image: Karen,
  },

];

export function PeopleCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const hoverDirectionRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const stopHoverScroll = () => {
    hoverDirectionRef.current = 0;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const stepHoverScroll = () => {
    const track = trackRef.current;

    if (!track || hoverDirectionRef.current === 0 || isDragging) {
      frameRef.current = null;
      return;
    }

    track.scrollLeft += hoverDirectionRef.current * 4;
    frameRef.current = window.requestAnimationFrame(stepHoverScroll);
  };

  const startHoverScroll = (direction: number) => {
    hoverDirectionRef.current = direction;

    if (frameRef.current === null && direction !== 0) {
      frameRef.current = window.requestAnimationFrame(stepHoverScroll);
    }
  };

  return (
    <div className={styles.about.peopleCarousel} aria-label="Meet our people cards">
      <div
        ref={trackRef}
        className={styles.about.peopleTrack}
        onMouseMove={(event) => {
          if (isDragging) {
            return;
          }

          const bounds = event.currentTarget.getBoundingClientRect();
          const edgeSize = Math.min(180, bounds.width * 0.22);
          const x = event.clientX - bounds.left;

          if (x < edgeSize) {
            startHoverScroll(-1);
          } else if (x > bounds.width - edgeSize) {
            startHoverScroll(1);
          } else {
            stopHoverScroll();
          }
        }}
        onMouseLeave={stopHoverScroll}
        onPointerDown={(event) => {
          const track = trackRef.current;

          if (!track) {
            return;
          }

          stopHoverScroll();
          setIsDragging(true);
          dragStartXRef.current = event.clientX;
          dragStartScrollRef.current = track.scrollLeft;
          track.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const track = trackRef.current;

          if (!track || !isDragging) {
            return;
          }

          const distance = event.clientX - dragStartXRef.current;
          track.scrollLeft = dragStartScrollRef.current - distance;
        }}
        onPointerUp={(event) => {
          const track = trackRef.current;

          setIsDragging(false);
          track?.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          setIsDragging(false);
        }}
      >
        {peopleCards.map((person) => (
          <article className={styles.about.peopleCard} key={person.name}>
            <img
              src={person.image}
              alt=""
              className={styles.about.peopleCardImage}
              draggable={false}
            />
            <div className={styles.about.peopleCardBody}>
              <p className={styles.about.peopleCardRole}>{person.role}</p>
              <h3 className={styles.about.peopleCardName}>{person.name}</h3>
              <p className={styles.about.peopleCardBio}>{person.bio}</p>
              &nbsp;
              <p className={styles.about.peopleCardBio}>{person.bioExt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
