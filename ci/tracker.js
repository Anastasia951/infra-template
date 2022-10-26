import * as github from '@actions/github'
const { OUATH_TOKEN, TICKET_ID, X_ORG_ID } = process.env

export async function updateTicket() {
  const regexp = /rc-0.0.(<maintenance>\d+)/
  console.log(regexp)
  const tag = github.context.ref_name
  console.log(tag)
  const { maintenance } = tag.match(regexp)
  console.log(maintenance)
}