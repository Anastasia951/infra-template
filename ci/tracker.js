import * as github from '@actions/github'
import * as core from '@actions/core'
import fetch from 'node-fetch'
const { OAUTH_TOKEN, TICKET_ID, X_ORG_ID } = process.env

const headers = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${OAUTH_TOKEN}`,
  'X-Org-ID': X_ORG_ID
}

const patchTicketURL = `https://api.tracker.yandex.net/v2/issues/${TICKET_ID}`

function formatTodayDate() {
  const today = new Date()
  return new Intl.DateTimeFormat('ru-RU').format(today)
}

export async function updateTicket() {
  const regexp = /rc-0.0.\d+$/
  const tag = github.context.ref
  const author = github.context.actor
  const version = tag.match(regexp)[0]

  try {
    await fetch(patchTicketURL, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        summary: `Релиз ${version} - ${formatTodayDate()}`,
        description: `Ответственный за релиз ${author}`
      })
    })
    console.log("Тикет успешно создан")
  } catch (e) {
    console.log("Ошибка при создании тикета")
  }
}

updateTicket()