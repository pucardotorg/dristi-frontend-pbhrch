export const leftColumnItems = [
  {
    title: "What is the 24x7 ON Court?",
    content: "The 24x7 ON Court is a new court launched by the Kerala High Court to handle cheque dishonour cases under Section 138 of the Negotiable Instruments Act. "
  },
  {
    title: "How do I access the 24x7 ON Courts portal?",
    content: `Visit the Home page of the website and click on the "Login as Litigant/Advocate" button to access the platform.`
  },
  {
    title: "What types of cases can be filed in this court?",
    content: "The 24x7 ON Court currently accepts only cheque dishonour cases filed under Section 138 of the Negotiable Instruments Act, 1881."
  },
  {
    title: "What is the jurisdiction of the 24x7 ON Court?",
    content: "The court currently accepts cases within the jurisdiction of the Kollam District Court."
  },
  {
    title: "Can I use the platform on a mobile device?",
    content: "The platform is currently accessible only on a desktop or laptop. Mobile access is under development."
  },
];

export const rightColumnItems = [
  {
    title: "What languages does the platform support?",
    content: "The platform supports both English and Malayalam language."
  },
  {
    title: "Is my data safe on this platform?",
    content: "Yes. All data is securely stored and can only be accessed through authenticated and authorized access via the DRISTI UI or REST APIs. Personally Identifiable Information (PII) is encrypted before storage, ensuring that no sensitive data is ever stored in plain text."
  },
  {
    title: "How does the platform ensure the confidentiality of case details?",
    content: "Case details are accessible only to users directly associated with the case. Access is strictly controlled through secure login and role-based permissions. Unauthorized users cannot view or modify any case information. The system is also regularly audited by third-party security agencies to ensure continued compliance with data protection standards."
  },
  {
    title: "How can I get support if I face any issues?",
    content: (
      <>
        <div className="mb-2">
          You can reach out to the 24x7 ON Courts Helpdesk through phone, email, online form, or in person:
        </div>

        <div className="pl-4 mb-2">
          <strong>i. Phone Support:</strong> Call{" "}
          <a href="tel:+914742919099" className="text-blue-600 underline" style={{ color: "#2563eb" }}>
            +91 474 2919099
          </a>{" "}
          (Monday to Saturday, 10:00 AM – 5:00 PM)
        </div>

        <div className="pl-4">
          <strong>ii. Email:</strong> Write to{" "}
          <a
            href="mailto:oncourtkollam@keralacourts.in"
            className="text-blue-600 underline"
            style={{ color: "#2563eb" }}
          >
            oncourtkollam@keralacourts.in
          </a>
        </div>
      </>
    ),
  },
  {
    title: "How can I report an issue or share feedback online?",
    content: (
      <>
        <p>You can submit issues, queries, or feature requests using the 24x7 ON Courts Support Form. The support team actively tracks all submissions and keeps you updated on the resolution status. Click here to access the form:</p>

        <a
          href="https://forms.gle/uCSgGiqGiMQYjjgeA"
          className="text-blue-600 underline"
          style={{ color: "#2563eb" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          24x7 ON Courts Support Form.
        </a>
      </>
    )
  },
];

export const contactBoxItems = {
  title: "Still have questions?",
  content: "Can’t find the answer you’re looking for? Reach out to our team!",
  buttonText: "Contact Us",
}