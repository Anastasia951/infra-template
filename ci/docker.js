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

async function createComment() {
  try {
    const regexp = /rc-0.0.\d+$/
    const tag = github.context.ref
    const version = tag.match(regexp)[0]

    await execPromised(`docker build -t image:${version} .`)
    console.log('Создание образа докера')
    const pathCommentsURL = `https://api.tracker.yandex.net/v2/issues/${TICKET_ID}/comments`

    console.log('Начало отправки запроса на создание комментария')

    await fetch(pathCommentsURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: `Собрали образ с тегом ${version}`,
      })
    })

    console.log('Комментарий успешно создан')

  } catch (e) {
    console.error("Ошибка при создании комментария", e.message)
  }
}

createComment()