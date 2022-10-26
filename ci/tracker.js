import * as github from '@actions/github'
import * as core from '@actions/core'
const { OUATH_TOKEN, TICKET_ID, X_ORG_ID } = process.env

export async function updateTicket() {
  const regexp = /rc-0.0.(<maintenance>\d+)/
  core.info(regexp)
  const tag = github.context.ref_name
  core.info(tag)
  const { maintenance } = tag.match(regexp)
  core.info(maintenance)
}