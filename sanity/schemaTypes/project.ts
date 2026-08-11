import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'The name of the project (e.g., /ST-GPT)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unique identifier for URL routing',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconName',
      title: 'Lucide Icon Name',
      type: 'string',
      description: 'Go to lucide.dev/icons and type the exact component name (e.g., Cpu, BarChart, Activity, BrainCircuit, PieChart, TrendingUp, BookOpen).',
      initialValue: 'Cpu',
    }),
    defineField({
      name: 'colorTheme',
      title: 'Icon & Glow Color Theme',
      type: 'string',
      description: 'Select the primary accent color for this project card.',
      options: {
        list: [
          { title: 'Electric Blue', value: 'blue' },
          { title: 'Emerald Green', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
          { title: 'Amber / Gold', value: 'amber' },
          { title: 'Cyan', value: 'cyan' },
          { title: 'Rose / Red', value: 'rose' },
          { title: 'Violet', value: 'violet' },
        ],
      },
      initialValue: 'blue',
    }),
    defineField({
      name: 'status',
      title: 'Status Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Active Development', value: 'Active Development' },
          { title: 'Completed', value: 'Completed' },
          { title: 'Published Research', value: 'Published Research' },
          { title: 'Archived', value: 'Archived' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'High-resolution image for the top of the project card',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'A summary paragraph explaining the project.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'array',
      description: 'List of bullet points detailing features or architecture.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack Tags',
      type: 'array',
      description: 'Technologies used (e.g., Streamlit, Llama 3.3, Python)',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source Code URL',
      type: 'url',
      description: 'Link to the GitHub repository',
    }),
    defineField({
      name: 'launchUrl',
      title: 'Live Demo URL',
      type: 'url',
      description: 'Link to the deployed application',
    }),
    defineField({
      name: 'agentContext',
      title: 'Hidden AI Agent Context',
      type: 'text',
      description: 'Technical details or challenges faced. This will not render on the website, but your RAG agent will read this.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'thumbnail',
    },
  },
})