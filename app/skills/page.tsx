import { client } from "../../sanity/lib/client";
import SkillsClient from "./SkillsClient";

// Ensure Next.js refetches this data periodically (e.g., every 60 seconds)
export const revalidate = 60;

export default async function SkillsPage() {
  // Fetch both schemas simultaneously and order them
  const query = `{
    "techStack": *[_type == "techStack"] | order(displayOrder asc) {
      _id, domainTitle, iconName, colorTheme, description, skillTags
    },
    "learning": *[_type == "currentlyLearning"] | order(displayOrder asc) {
      _id, roadmapTitle, colorTheme, description, topicTags
    }
  }`;
  
  const data = await client.fetch(query);
  const techStack = data.techStack || [];
  const learning = data.learning || [];

  // Pass the fully populated data directly into the animated Client Component
  return <SkillsClient initialTechStack={techStack} initialLearning={learning} />;
}