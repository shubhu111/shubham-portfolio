import { client } from "@/sanity/lib/client";
import ProjectsClient from "./ProjectsClient";

// Ensure Next.js refetches this data periodically (e.g., every 60 seconds)
// so you don't have to rebuild the site when you publish a new project.
export const revalidate = 60;

export default async function ProjectsPage() {
  // 1. Fetch data on the Server
  const query = `*[_type == "project"] | order(_createdAt desc) {
    "id": slug.current,
    title,
    status,
    iconName,
    colorTheme,
    "image": thumbnail.asset->url,
    description,
    "features": highlights,
    "tech": techStack,
    "links": {
      "github": sourceUrl,
      "live": launchUrl
    }
  }`;
  
  const projects = await client.fetch(query);

  // 2. Pass the fully populated data directly into your animated Client Component
  return <ProjectsClient initialProjects={projects} />;
}