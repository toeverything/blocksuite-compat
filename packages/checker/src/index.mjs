import path from 'node:path'
import fs from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Workspace, Generator } from '@blocksuite/store'
import { builtInSchemas } from '@blocksuite/blocks/models'

const env =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : {}
delete env['__ $BLOCKSUITE_STORE$ __']
delete env['__ $BLOCKSUITE_BLOCKS$ __']

const dataSources = fileURLToPath(
  new URL('../../../data-source', import.meta.url))

async function main () {
  const dirs = await fs.readdir(dataSources)
  for (const dir of dirs) {
    const { generator, encodeAsUpdate } = await import(
      path.resolve(dataSources, dir, 'src', 'index.mjs')
      )
    // remove side effect
    delete env['__ $BLOCKSUITE_STORE$ __']
    delete env['__ $BLOCKSUITE_BLOCKS$ __']
    const oldWorkspace = await generator()
    const update = encodeAsUpdate(oldWorkspace)
    const newWorkspace = new Workspace({
      room: 'checker',
      providers: [],
      idGenerator: Generator.NanoID,
      isSSR: true
    }).register(builtInSchemas)
    const json = await new Promise(resolve => {
      newWorkspace.signals.pageAdded.once((pageId) => {
        resolve(newWorkspace.doc.toJSON())
      })
      Workspace.Y.applyUpdate(newWorkspace.doc, update)
    })

    console.log('merge result', json)
  }
}

main().then(() => {
  console.log('success!')

  // old workspace has a pending promise
  process.exit(0)
})
