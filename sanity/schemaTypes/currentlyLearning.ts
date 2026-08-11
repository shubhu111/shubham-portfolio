import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'currentlyLearning',
  title: 'Currently Learning',
  type: 'document',
  fields: [
    defineField({
      name: 'roadmapTitle',
      title: 'Roadmap Title',
      type: 'string',
      description: 'e.g., MLOps Infrastructure, GenAI Evaluation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colorTheme',
      title: 'Dashed Border Color Theme',
      type: 'string',
      description: 'Select the color for this roadmap card.',
      options: {
        list: [
          { title: 'Electric Blue', value: 'blue' },
          { title: 'Emerald Green', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
        ],
      },
      initialValue: 'blue',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Progress Overview / Syllabus',
      type: 'text',
      description: 'Detailed summary of the roadmap and what you are transitioning to.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'topicTags',
      title: 'Topic Tags',
      type: 'array',
      description: 'Specific frameworks or concepts being learned (e.g., Docker, MLflow, LangSmith).',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'status',
      title: 'Status Badge',
      type: 'string',
      options: {
        list: [
          { title: 'In Progress', value: 'IN PROGRESS' },
          { title: 'Planned', value: 'PLANNED' },
          { title: 'Completed', value: 'COMPLETED' },
        ],
        layout: 'radio',
      },
      initialValue: 'IN PROGRESS',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Set the order in which this roadmap appears on the page.',
      initialValue: 1,
    }),
    defineField({
      name: 'agentContext',
      title: 'Hidden AI Agent Context',
      type: 'text',
      description: 'Internal notes on course modules, specific tutorials, or challenges faced for the RAG Agent.',
    }),
  ],
  preview: {
    select: {
      title: 'roadmapTitle',
      subtitle: 'status',
    },
  },
})