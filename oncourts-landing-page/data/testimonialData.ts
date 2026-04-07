export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

export const testimonialData = {
  title: "Hear from Our Users",
  description:
    "Discover how 24x7 ON Courts is transforming legal practice through the transformed experiences of advocates, clerks, and litigants.",
  testimonials: [
    {
      id: 1,
      name: "Nikhil J George",
      role: "Advocate",
      image: "/images/nikhil_Advocate.png",
      content:
        "At first, understanding the filing process was a bit challenging, but now it's smooth and easy. I’ve filed multiple cases from my office, and for any doubts, the court staff and helpdesk was very helpful. The system is very convenient and efficient!",
    },
    {
      id: 2,
      name: "Dhanya R.",
      role: "Advocate Clerk",
      image: "/images/dharya.png",
      content:
        "The filing process is simple and easy to use. Advocate clerks can manage it efficiently, and I can now handle all filings on my own. Overall, the system is very convenient, and I am completely satisfied with it.",
    }
  ],
};
