import { Workspace, Text, Generator } from '@blocksuite/store'
import { BlockSchema } from '@blocksuite/blocks/models'

export function encodeAsUpdate(workspace) {
  return Workspace.Y.encodeStateAsUpdate(workspace.doc)
}

export async function generator() {
  return new Promise(resolve => {
    const workspace = new Workspace({
      room: Generator.UUIDv4,
      idGenerator: 'uuidV4',
      providers: [],
      isSSR: true,
    })
    workspace.register(BlockSchema)
    workspace.signals.pageAdded.once(id => {
      const page = workspace.getPage(id)
      const pageBlockId = page.addBlock({
        flavour: 'affine:page',
        title: 'Welcome to BlockSuite playground',
      })
      const groupId = page.addBlock({ flavour: 'affine:group' }, pageBlockId)
      page.addBlock(
        {
          flavour: 'affine:paragraph',
          text: new Text(
            page,
            'This playground is a demo environment built with BlockSuite.'
          ),
        },
        groupId
      )
      page.addBlock(
        {
          flavour: 'affine:paragraph',
          text: Text.fromDelta(page, [
            {
              insert: 'Try ',
            },
            {
              insert: 'typing',
              attributes: {
                bold: true,
              },
            },
            {
              insert: ', ',
            },
            {
              insert: 'formatting',
              attributes: {
                italic: true,
              },
            },
            {
              insert: ', and ',
            },
            {
              insert: 'dragging',
              attributes: {
                underline: true,
                strike: false,
              },
            },
            {
              insert: ' here!',
            },
          ]),
        },
        groupId
      )
      page.addBlock(
        {
          flavour: 'affine:paragraph',
          text: Text.fromDelta(page, [
            {
              insert: 'A quick tip 💡: Try removing the ',
            },
            {
              insert: '?init',
              attributes: {
                code: true,
              },
            },
            {
              insert: ' part in the URL and open it in another tab!',
            },
          ]),
        },
        groupId
      )
      page.resetHistory()
      resolve(workspace)
    })

    workspace.createPage('page0')
  })
}
