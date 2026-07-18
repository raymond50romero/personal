export interface Project {
  id: string;
  name: string;
  description: string;
  /** Placeholder gradient until real screenshots are added. */
  image: string;
}

export const projects: Project[] = [
  {
    id: "project-one",
    name: "Project One",
    description:
      "A full stack web application built with React, Node.js and PostgreSQL. Replace this with a short pitch of what the project does and the problems it solves.",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "project-two",
    name: "Project Two",
    description:
      "A real-time dashboard powered by WebSockets and a streaming data pipeline. Swap this description for your own once you plug in real projects.",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "project-three",
    name: "Project Three",
    description:
      "A mobile-first e-commerce experience with a headless CMS backend and Stripe integration.",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "project-four",
    name: "Project Four",
    description:
      "A developer tool / CLI that automates a painful workflow. Describe the stack and your role here.",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: "project-five",
    name: "Project Five",
    description:
      "A machine learning powered API deployed on the cloud with CI/CD and infrastructure as code.",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "project-six",
    name: "Project Six",
    description:
      "An open source contribution or side experiment worth showing off. Anything goes here.",
    image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];
