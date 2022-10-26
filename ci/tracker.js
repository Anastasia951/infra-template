import * as github from '@actions/github'
import * as core from '@actions/core'
const { OUATH_TOKEN, TICKET_ID, X_ORG_ID } = process.env

export async function updateTicket() {
  const regexp = /rc-0.0.(<maintenance>\d+)/
  const tag = github.context.ref
  core.info(tag)
  const { maintenance } = tag.match(regexp)
  core.info(maintenance)
}

updateTicket()