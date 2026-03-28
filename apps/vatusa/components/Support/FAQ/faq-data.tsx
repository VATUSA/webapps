export type FAQItem = {
  id: string
  question: string
  answer: string
}

export type FAQCategory = {
  id: string
  title: string
  items: FAQItem[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: "membership",
    title: "Membership",
    items: [
      {
        id: "membership-become-controller",
        question: "How do I become a VATUSA Air Traffic Controller?",
        answer:
          "Start by creating your VATSIM account, then complete the required onboarding and Academy steps for your selected facility. Follow your facility’s training process after enrollment.",
      },
      {
        id: "membership-rejoin-after-away",
        question: "How do I rejoin as a controller after I've been away?",
        answer:
          "Return through your member profile and facility workflow. If your certifications or activity are out of date, staff may ask you to complete refresher steps.",
      },
      {
        id: "membership-transfer-visitor",
        question:
          "I am a controller from a different Division and/or Region but would like to become a controller at VATUSA (transfer or visitor). How do I get started?",
        answer:
          "Submit the appropriate transfer or visitor request from your profile and follow facility instructions. Staff will review your current status and eligibility.",
      },
      {
        id: "membership-transfer-request-unavailable",
        question: "Why can I not submit a transfer request?",
        answer:
          "Transfer requests may be unavailable due to account state, eligibility rules, or existing pending actions. Confirm your account details and then contact support if needed.",
      },
      {
        id: "membership-cancel-transfer",
        question:
          "I put in a transfer request, but wish to cancel it. What do I do?",
        answer:
          "Contact the receiving facility or support team as soon as possible and ask them to close/cancel the pending transfer request.",
      },
      {
        id: "membership-change-region-division",
        question: "How do I change my region? How do I change my division?",
        answer:
          "Region/division changes are handled through your VATSIM profile and applicable transfer workflow. Ensure your profile is current before submitting.",
      },
      {
        id: "membership-change-name-email",
        question:
          "How do I change my name (including preferred name) or email address?",
        answer:
          "Update account identity/contact fields in your VATSIM account profile. If something does not sync correctly, open a support ticket.",
      },
      {
        id: "membership-forgot-password",
        question: "I forgot my password, now what?",
        answer:
          "Use the account password reset flow in your VATSIM account portal. If you still cannot access your account, contact support.",
      },
      {
        id: "membership-real-world-atc",
        question:
          "I'm a real-world air traffic controller, do I still have to complete VATUSA's training before controlling?",
        answer:
          "Yes, in most cases VATUSA onboarding/training requirements still apply so members operate consistently within network procedures.",
      },
      {
        id: "membership-real-world-pilot",
        question:
          "I'm a real-world pilot, do I still have to complete VATUSA's training before controlling?",
        answer:
          "Yes. Real-world pilot experience is valuable, but controller certification requirements still apply for network ATC operations.",
      },
      {
        id: "membership-suspended",
        question: "What do I do if I have been suspended?",
        answer:
          "Follow the notice you received and contact the appropriate support/staff channel for clarification and next steps.",
      },
    ],
  },
  {
    id: "data-web-services",
    title: "Data & Web Services",
    items: [
      {
        id: "web-error-vatusa-site",
        question: "I noticed an error on the VATUSA website, who do I contact?",
        answer:
          "Submit a support ticket with steps to reproduce, screenshots, browser/device details, and relevant page URL.",
      },
      {
        id: "web-error-subdivision-site",
        question:
          "I noticed an error on my subdivision's website. Who should I contact?",
        answer:
          "Contact that subdivision’s web/staff team first. If you are unsure where to start, open a support ticket and we can route it.",
      },
    ],
  },
  {
    id: "training-academy",
    title: "Training Academy",
    items: [
      {
        id: "academy-cannot-see-courses",
        question:
          "I just joined VATUSA and I cannot see any courses. What do I do?",
        answer:
          "New enrollments can take a short time to sync. If courses still do not appear, open a support ticket with your CID and facility.",
      },
      {
        id: "academy-cannot-access-exam",
        question:
          "I completed all of the necessary activities, but I cannot access the exam. What do I do?",
        answer:
          "Confirm all prerequisites are marked complete, then refresh/re-log. If blocked, contact Academy support with course details.",
      },
      {
        id: "academy-fail-exam-three-times",
        question: "What if I fail a rating exam three times?",
        answer:
          "Follow Academy policy for retake eligibility and remediation steps. Staff may require review/training before another attempt.",
      },
      {
        id: "academy-questions-not-graded",
        question: "Why are some of my exam questions not graded?",
        answer:
          "Some responses require manual review or may be pending finalization. If grading appears stuck, contact Academy support.",
      },
      {
        id: "academy-course-expired",
        question:
          "What if I haven't finished the course by the end of the 30-day enrollment period?",
        answer:
          "Request re-enrollment or extension according to Academy policy by contacting the training team/support.",
      },
      {
        id: "academy-next-rating-course",
        question:
          "I'm ready to start the Academy course for my next rating. What do I do?",
        answer:
          "Verify current rating prerequisites and request progression through your facility/training workflow.",
      },
      {
        id: "academy-training-material-error",
        question:
          "I noticed an error in my facility's exam or training material. Who do I contact?",
        answer:
          "Report it to facility training staff and include the exact lesson/exam item, screenshot, and expected correction.",
      },
      {
        id: "academy-basic-atc-which-subdivision",
        question:
          "I just completed my Basic ATC/S1 exam. Which subdivision should I join?",
        answer:
          "Choose the facility you plan to train/control in, then follow that subdivision’s onboarding and local training process.",
      },
    ],
  },
]
