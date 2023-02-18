import * as Y from 'yjs'
import fs from 'node:fs/promises'

const doc = new Y.Doc()
fs.readFile('../../../data-source/broken/broken02.ydoc').then((data) => {
  Y.applyUpdate(doc, data)
  console.log(doc)
})
