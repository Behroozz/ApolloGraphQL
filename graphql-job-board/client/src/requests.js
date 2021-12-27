import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'
import gql from 'graphql-tag'
import { Fragment } from 'react'
import { getAccessToken, isLoggedIn } from "./auth"
import JobDetail from './JobDetail'

const endpointURL = 'http://localhost:9000/graphql'
const authLink = new ApolloLink((operation, forward) => {
  if(isLoggedIn()) {
  operation.setContext({
    headers: {
      'authorization': 'Bearer ' + getAccessToken()
    }
    })
  }
  return forward(operation)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({ uri: endpointURL })
  ]),
  cache: new InMemoryCache()
})

// async function graphqlRequest(query, variables={}) {
//   const request = {
//     method: 'POST',
//     headers: { 'content-type': 'application/json'},
//     body: JSON.stringify({ query, variables })
//   }
//   if(isLoggedIn()) {
//     request.headers['authorization'] = 'Bearer ' + getAccessToken()
//   }
//   const response = await fetch(endpointURL, request)
//   const responseBody = await response.json()
//   if(responseBody.errors) {
//     const message = responseBody.errors.map((error)=> error.message).join('\n')
//     throw new Error(message)
//   }
//   return responseBody.data
// }

const JobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }`

const JobQuery = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        ...JobDetail
      }
    }
    ${JobDetailFragment}
  `

const compnayQuery = gql`query CompanyQuery($id: ID!) {
  company(id: $id) {
    id
    name
    description
    jobs {
      id
      title
    }
  }
}`

const jobsQuery = gql`{
  jobs {
      ...JobDetail
    }
  }
  ${JobDetailFragment}
`

const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input) {
      ...JobDetail
      }
    }
    ${JobDetailFragment}
  `

export async function loadJobs() {
  const { data: { jobs } } = await client.query({ query: jobsQuery, fetchPolicy: 'no-cache' })
  // const { jobs } = await graphqlRequest(query)
  return jobs
}

export async function loadJob(id) {
  
  const { data: { job } } = await client.query({ query: JobQuery, variables: {id} })
  // const { job } = await graphqlRequest(query, {id})
  return job
}

export async function loadCompany(id) {
  const { data: { company } } = await client.query({ query: compnayQuery, variables: {id} })
  // const { company } = await graphqlRequest(query, {id})
  return company
}

export async function createJob(input) {
  const { data: { job } } = await client.mutate({ 
    mutation: createJobMutation, 
    variables: {input},
    // whenver you ran the query save it in cache first
    update: (store, { data } ) => {
      store.writeQuery({
        query: JobQuery, 
        variables: {id: data.job.id},
        data
      })
    } 
  })
  // const {job} = await graphqlRequest(mutation, {input})
  return job
}