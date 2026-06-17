import { Page, PageStack } from "../components/UI";
import { JoinUsBanner } from "../components/JoinUsBanner";
import background from "../images/faqs-background.webp";
import { styles } from "../styles";
import type { CSSProperties } from "react";
import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: AccordionItem[] = [
    {
      question: "Do I need to be fit?",
      answer: "No. Classes are designed for all levels."
    },
    {
      question: "What if I feel nervous?",
      answer: "That's completely normal. Most people do at first."
    },
    {
      question: "Do I have to do everything in the class?",
      answer: "No. You can sit out at any time."
    },
    {
      question: "Is it aggressive?",
      answer: "No. We focus on awareness, confidence, and control."
    },
    {
      question: "What should I wear?",
      answer: "Anything comfortable, you can workout out in. Gym gear is probably your best bet."
    },
    {
      question: "Can I come alone?",
      answer: "Yes. Many of our members come alone and find it a great way to meet new people."
    },
    {
      question: "What if I have a disability?",
      answer: "We welcome people of all abilities. Just let us know if you have any specific needs and we'll do our best to accommodate you."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      {faqData.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={`accordion-item ${isOpen ? "is-open" : ""}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="accordion-header">
              <h3 className="accordion-question">{item.question}</h3>
              <span className="accordion-toggle-icon">
                {isOpen ? "−" : "+"}
              </span>
            </div>
            <div className="accordion-content">
              <p className="accordion-answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQs() {
  return (
    <Page className={styles.faqs.page}>
      <PageStack className={styles.faqs.stack}>
        <section
          className={styles.faqs.hero}
          aria-label="Self-defence classes"
          style={{ "--background-image": `url(${background})` } as CSSProperties}
        />

        <section className={styles.faqs.intro} aria-labelledby="faqs-intro-title">
          <h1 id="faqs-intro-title" className={styles.faqs.introTitle}>
            FAQs
          </h1>
          <div>
            <Accordion />
          </div>
        </section>
        <JoinUsBanner />
      </PageStack>
    </Page>
  );
}
