// TODO: Implement this function to return a list of related FAQs based on the subject and body of the email.
module.exports.getRelatedFAQs = function (subject, body) {
  // TODO: Implement FAQs in a Vector DB so we can find the closest matches to the question the custom asked.
  return [
      {
          question: "How do I request a receipt from an in-store purchase?",
          answer: `If your purchase was made within 48 hours, you may request a copy of the receipt in the store.

          To request a copy from our Electronic Payment Team, please email the following information to ml.epc.serv@heb.com 
          
          ATTN: Front End Services: Credit/Debit Card Receipt Request
          
          •       First and Last name of customer
          •       Date of Purchase
          •       Amount of Purchase
          •       Location of Purchase
          •       First 6 and Last 4 Digits of Card Number used (For your security, please do not send the full credit card number)
          •       Copy of Work Badge, Business Card, or State License/ID
          •       Written Statement authorizing HEB to release receipt (“I authorize HEB to submit the following inquiry…”)
          •       Call Back number
          •       Email you would like to receive the receipt`
      },
      {
          question: "How can I purchase H‑E‑B Gift Cards?",
          answer: "H‑E‑B gift cards are great gift ideas for the holidays, graduation, work incentives, or just because. You can purchase H‑E‑B gift cards online or at any of our store locations. Store locations have a limit of 10 cards or $1,000 per purchase. If there is not a store in your area, or do not wish to order online, please contact our Gift Cards Department at 1‑800‑987‑4438. Our office hours: Monday ‑ Friday 8 a.m. to 5 p.m. You can order gift cards online here: https://www.heb.com/giftcards/"
      },
      {
          question: "How do I apply to become a supplier in your stores?",
          answer: "We're so glad you're interested in being a vendor in our stores. We have a simple process to get in touch with our buyers for consideration. Visit our supplier website (https://supplier.heb.com/home) to get all the details and fill out your application. You may also want to see if you're eligible for our supplier diversity program (https://supplier.heb.com/diversity)."
      }
      // ... You can add more mock FAQs if needed
  ];
};
