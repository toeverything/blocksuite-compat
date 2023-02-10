import { Workspace, Generator } from '@blocksuite/store'
import { builtInSchemas, __unstableSchemas } from '@blocksuite/blocks/models'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function encodeAsUpdate (workspace) {
  return Workspace.Y.encodeStateAsUpdate(workspace.doc)
}

export async function generator () {
  return new Promise(async resolve => {
    const workspace = new Workspace({
      room: Generator.UUIDv4, idGenerator: 'uuidV4', providers: [], isSSR: true
    })
    workspace.register(builtInSchemas).register(__unstableSchemas);
    Workspace.Y.applyUpdate(workspace.doc, await fs.readFile(path.resolve(
      fileURLToPath(new URL('./fixtures/basic.ydoc', import.meta.url))))
    )
    resolve(workspace)
  })
}

