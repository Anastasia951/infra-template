import * as github from '@actions/github'
import { exec } from 'child_process'
import fetch from 'node-fetch'
import { promisify } from 'util';

const execPromised = promisify(exec)
const { OAUTH_TOKEN, TICKET_ID, X_ORG_ID } = process.env

const headers = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${OAUTH_TOKEN}`,
  'X-Org-ID': X_ORG_ID
}

function formatTodayDate() {
  const today = new Date()
  return new Intl.DateTimeFormat('ru-RU').format(today)
}

export async function createTicket() {
  const patchTicketURL = `https://api.tracker.yandex.net/v2/issues/${TICKET_ID}`
  const regexp = /rc-0.0.\d+$/
  const tag = github.context.ref
  const author = github.context.actor
  const version = tag.match(regexp)[0]
  const maintenance = version.split('.').pop()
  const description = await getDescription(maintenance)

  try {
    console.log('Начало отправки запроса на создания тикета...')
    await fetch(patchTicketURL, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        summary: `Релиз ${version} - ${formatTodayDate()}`,
        description: `Ответственный за релиз ${author} \n\n Коммиты, попавшие в релиз: \n\n ${description}`
      })
    })
    console.log("Тикет успешно создан")
  } catch (e) {
    console.error("Ошибка при создании тикета", e.message)
  }
}
async function getCommitsBetweenTags(currentTag) {
  const gitLogCommand = `git log --pretty="%cn - %H" ${currentTag === 1 ? "rc-0.0.1" : `rc-0.0.${currentTag - 1}...rc-0.0.${currentTag}`}`
  console.log('Получение коммитов')
  const { stdout: logs } = await execPromised(gitLogCommand)

  return logs
}
async function getDescription(currentTag) {
  try {
    const description = await getCommitsBetweenTags(currentTag)
    return description
  } catch (e) {
    console.log(e.message)
  }
}
createTicket()