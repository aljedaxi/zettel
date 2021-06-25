- https://github.com/CondeNast/atjson
- https://atjson.condenast.io/docs/structure
	- try doing this: `yarn add @atjson/document @atjson/renderer-react`
	- define our document as such:
	  ```js
	  import Document, { InlineAnnotation } from '@atjson/document'
	  class Tag extends InlineAnnotation {
	  	static type = 'tag'
	  }
	  class Augury extends Document {
	  	static schema = [Tag]
	  }
	  ```
	  thence we can create particular documents as such:
	  ```js
	  const testAnnotation = [
	  	new Tag({ id: '1', attributes: { tag: 'person' }, start: 0, end: 5 })
	  ]
	  const doc = new Augury({content: 'kathy', annotations: testAnnotation})
	  ```
	  and render them as such:
	  ```js
	  import Renderer, { ReactRendererProvider } from '@atjson/renderer-react'
	  const TagView = p => {
	  	const { children, tag /*this is from the attributes defined in new Tag*/ } = p
	  	return c (Tooltip) ({title: tag}) (
	  		span ({style: {backgroundColor: 'yellow'}}) ([
	  			children,
	  		])
	  	)
	  }
	   c (ReactRendererProvider) ({value: {Tag: TagView}}) (Renderer.render (doc))
	  ```