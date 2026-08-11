import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import techStack from './techStack'
import currentlyLearning from './currentlyLearning'
import agentContext from './agentContext' // Import it here

export const schema: { types: SchemaTypeDefinition[] } = {
  // Add it to the array
  types: [project, techStack, currentlyLearning, agentContext], 
}