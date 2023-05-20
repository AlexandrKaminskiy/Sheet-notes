const {buildSchema} = require('graphql')

const schema = buildSchema(`
    scalar Date
    type Note {
        id: ID
        name: String
        description: String
        bpm: Int
        complexity: Int
        duration: Int
        instrument: String
        creation_date: Date
        filename: String
    }
    
    input NoteInput {
        name: String!
        description: String!
        bpm: Int!
        complexity: Int!
        duration: Int!
        instrument: String!
    }
    
    type Query {
        getNotes(token: String!): [Note]
        getNote(id: Int!): Note
    }
    
    type Mutation {
        createNote(token: String!, note: NoteInput!): Note
        deleteNote(id: Int!): Int
    }
`)

module.exports = schema