import fs from 'node:fs/promises'
import { __unstableSchemas, builtInSchemas } from '@blocksuite/blocks/models'
import { Workspace } from '@blocksuite/store'

const ws = new Workspace({
  room: 1,
  isSSR: true
})
ws.register(builtInSchemas).register(__unstableSchemas)

const ws2 = new Workspace({
  room: 2,
  isSSR: true
})
ws2.register(builtInSchemas).register(__unstableSchemas)

fs.readFile('../../data-source/broken/broken01.ydoc').then(async (data) => {
  const data2 = await fs.readFile('../../data-source/broken/broken02.ydoc')
  Workspace.Y.applyUpdate(ws.doc, data2)
  Workspace.Y.applyUpdate(ws2.doc, data)
  // console.log(ws.doc.toJSON())
  ws2.meta.pages.toJSON().forEach((data) => {
    console.log('data', data)
    const page = ws2.getPage(data.id)
    console.log(page)
  })
})
