import * as github from '@actions/github'
import { exec } from 'child_process'
import { promisify } from 'util';
import fetch from 'node-fetch'


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

export async function updateTicket() {
  const patchTicketURL = `https://api.tracker.yandex.net/v2/issues/${TICKET_ID}`
  const regexp = /rc-0.0.\d+$/
  const tag = github.context.ref
  const author = github.context.actor
  const version = tag.match(regexp)[0]
  const maintenance = version.split('.').pop()

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

    await createComment(maintenance)
  } catch (e) {
    console.log("Ошибка при создании тикета")
  }
}
async function getCommitsBetweenTags(currentTag) {
  const gitLogCommand = `git log --pretty="format:%an - %H" ${currentTag === 1 ? "...rc-0.0.1" : `rc-0.0.${currentTag - 1}...rc-0.0.${currentTag}`}`
  const { stdout: logs } = await execPromised(gitLogCommand)

  return logs
}
async function createComment(currentTag) {
  const pathCommentsURL = `https://api.tracker.yandex.net/v2/issues/${TICKET_ID}/comments`
  try {
    const text = await getCommitsBetweenTags(currentTag)
    const result = await fetch(pathCommentsURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
      })
    })
    console.log('RESULT', result)
    console.log("Комментарий успешно создан")
  } catch (e) {
    console.log("Ошибка при создании комментария")
  }
}
// updateTicket()
updateTicket()