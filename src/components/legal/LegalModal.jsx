import React from "react";
import Icon from "../common/Icon";

const POLICY_CONTENT = {
  terms: {
    eyebrow: "Using Chagga",
    title: "Terms of use",
    sections: [
      ["What Chagga does", "Chagga helps senders find travellers who may be willing to carry small items. During this MVP, Chagga is a matching and communication platform—not a courier, freight company, insurer, payment provider, or customs agent."],
      ["Your responsibilities", "Use accurate information, inspect every item before handover, agree clearly on the route and timing, and communicate respectfully. Senders must accurately describe the contents. Travellers may refuse any item at any time before accepting it."],
      ["Payments", "Chagga does not currently collect, hold, guarantee, or release payments. Any payment arranged between users happens outside the platform and is the users’ responsibility."],
      ["No guaranteed delivery", "A post, match, or conversation does not guarantee that a delivery will happen. Users are responsible for deciding whether to proceed and for keeping their own records of any agreement."],
      ["Account use", "You must keep your account secure and must not impersonate another person, post misleading information, harass members, or use Chagga for unlawful activity."],
    ],
  },
  privacy: {
    eyebrow: "Your information",
    title: "Privacy",
    sections: [
      ["Information we use", "Chagga stores the account details you provide, your profile, trips, delivery requests, matches, messages, delivery updates, ratings, and profile picture when supplied."],
      ["Why we use it", "We use this information to operate accounts, show relevant public profiles and posts to signed-in members, connect users, provide conversations and status updates, improve the MVP, and respond to safety concerns."],
      ["What other members see", "Signed-in members may see your name, profile picture, rating, usual routes, public trips or requests, and completed-delivery statistics. Your email address and phone number are not displayed as public profile information."],
      ["Service providers", "Authentication, database, and file storage are provided through Supabase. Technical providers may process information only as needed to operate the service."],
      ["Your choices", "You can update your profile picture, name, and usual routes. Contact the Chagga team to request account or personal-data deletion while self-service deletion is not yet available."],
    ],
  },
  safety: {
    eyebrow: "Before every handover",
    title: "Safety policy",
    sections: [
      ["Inspect every item", "Never carry a sealed, unidentified, incorrectly described, or suspicious package. Open and inspect the item with the sender before accepting it."],
      ["Prohibited items", "Do not use Chagga for illegal drugs, weapons, explosives, dangerous chemicals, counterfeit goods, stolen goods, undeclared currency, or any item prohibited by an airline, airport, customs authority, or destination country."],
      ["Customs and airline rules", "The sender and traveller must check the rules that apply to the full journey. Chagga does not provide customs clearance or confirm whether an item is legal to import, export, or carry."],
      ["Personal safety", "Meet in a public place, tell someone you trust about the handover, avoid sharing unnecessary personal information, and stop the exchange if you feel pressured or unsafe."],
      ["Report concerns", "Keep messages on Chagga where possible. If a user or item appears unsafe, do not continue with the delivery and report the concern to the Chagga team and, where necessary, local authorities."],
    ],
  },
};

const LegalModal = ({ policy, onClose }) => {
  const content = POLICY_CONTENT[policy];
  if (!content) return null;

  return (
    <div className="market-modal-overlay legal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="market-modal legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
        <header className="market-modal-header legal-modal-header">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 id="legal-modal-title">{content.title}</h2>
            <p>Last updated: 13 September 2026</p>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close policy">
            <Icon name="close" />
          </button>
        </header>
        <div className="legal-content">
          <p className="legal-intro">This plain-language policy is for Chagga’s early MVP and may be updated as the service develops.</p>
          {content.sections.map(([heading, body]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <p>{body}</p>
            </section>
          ))}
          <div className="legal-warning"><Icon name="shield" size={18} /><span>If you are unsure whether an item is permitted, do not carry it.</span></div>
        </div>
        <footer className="market-modal-actions legal-actions">
          <button type="button" className="primary-action" onClick={onClose}>I understand</button>
        </footer>
      </section>
    </div>
  );
};

export default LegalModal;
