import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'techStack',
  title: 'Core Technical Stack',
  type: 'document',
  fields: [
    defineField({
      name: 'domainTitle',
      title: 'Domain Title',
      type: 'string',
      description: 'e.g., GenAI, Deep Learning, NLP',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconName',
      title: 'Lucide Icon Name',
      type: 'string',
      description: 'Go to lucide.dev/icons and type the exact component name here (e.g., Database, Cloud, Server, Cpu, BrainCircuit).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'string',
      description: 'Select the glowing hover color for this card.',
      options: {
        list: [
          { title: 'Electric Blue', value: 'blue' },
          { title: 'Emerald Green', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
          { title: 'Amber / Yellow', value: 'amber' },
          { title: 'Pink / Rose', value: 'pink' },
          { title: 'Latent Gray', value: 'gray' },
        ],
      },
      initialValue: 'blue',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short summary paragraph below the header.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'skillTags',
      title: 'Skill Tags',
      type: 'array',
      description: 'Individual framework or tool tags (e.g., RAG, LLM, Vector Database).',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Set the order in which this card appears on the grid (1 for first, 2 for second, etc.).',
      initialValue: 1,
    }),
    defineField({
      name: 'agentContext',
      title: 'Hidden AI Agent Context',
      type: 'text',
      description: 'Detailed explanation of how you apply these skills in production for your RAG Agent.',
    }),
  ],
  preview: {
    select: {
      title: 'domainTitle',
      subtitle: 'description',
    },
  },
})