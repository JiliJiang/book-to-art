import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedArts {
        artId
        authors
        image
        description
        title
        link
      }
    }
  }
`;
