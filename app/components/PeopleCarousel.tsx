import { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import portrait from "../images/about_2.webp";

type PersonCard = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

const peopleCards: PersonCard[] = [
  {
    name: "Marios",
    role: "Instructor",
    bio: "Software engineer by daytime. Experienced self-defence instructor by night time. Glasgow resident. Extroverted introvert with a love for games, books, cooking and mocking his sister.",
    image: portrait,
  },
  {
    name: "Ryan",
    role: "Instructor",
    bio: "Software developer by daytime. A blend of Ireland and Manchester and full of dry humour. Self-defence instructor with over 10 years experience in the field. Addicted to late mornings and pastries.",
    image: portrait,
  },
  {
    name: "Anna",
    role: "Coordinator",
    bio: "Also known as Sofia, goes by both her names. Brand designer, coffee addict, the personification of creative chaos.",
    image: portrait,
  },
  {
    name: "Bonus Person",
    role: "Volunteer",
    bio: "👀",
    image: portrait,
  },
   {
    name: "Bonus Person 2",
    role: "Volunteer",
    bio: "👀👀👀\n just to demonstrate the scrolling/dragging",
    image: portrait,
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
