import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'agentContext',
  title: 'AI Agent Knowledge Store',
  type: 'document',
  description: 'Hidden background stories, project challenges, and bio details strictly for your RAG Agent.',
  fields: [
    defineField({
      name: 'topic',
      title: 'Topic Title',
      type: 'string',
      description: 'e.g., Hospital Portal Data Pipeline Challenges, Personal Journey',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Personal Story & Bio', value: 'bio' },
          { title: 'Project Deep Dive', value: 'project-deep-dive' },
          { title: 'Work Experience', value: 'career' },
          { title: 'Technical QA', value: 'qa' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Detailed Narrative Context',
      type: 'text',
      description: 'Write complete details here. This gets chunked and vectorized without appearing publicly on the main frontend.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'topic',
      subtitle: 'category',
    },
  },
})