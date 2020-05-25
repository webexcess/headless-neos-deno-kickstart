export function Node() : string {
  return `
    fragment NodeFields on Node {
      value
    }
  `
}

export function Image() : string {
  return `
    fragment ImageFields on Image {
      image {
        uri
        width
        height
        alt
      }
      link
    }
  `
}

export function YouTube() : string {
  return `
    fragment YouTubeFields on YouTube {
      value
      caption
      image {
        uri
        width
        height
        alt
      }
    }
  `
}

export function NodeCollection() : string {
  return `
    fragment NodeCollectionFields on NodeCollection {
      content: children {
        type
        identifier
        group
        options
    
        ...NodeFields
        ...ImageFields
        ...YouTubeFields
    
        ... on NodeCollection {
          content: children {
            type
            identifier
            group
            options
    
            ...NodeFields
            ...ImageFields
            ...YouTubeFields
    
            ... on NodeCollection {
              content: children {
                type
                identifier
                group
                options
    
                ...NodeFields
                ...ImageFields
                ...YouTubeFields
              }
            }
          }
        }
      }
    }
  `
}

export function TabbedSubpagesContent() : string {
  return `
    fragment TabbedSubpagesContentFields on TabbedSubpagesContent {
      children {
        type
        identifier
        group
        options
        title
        uriPath
        children(filter: {type: {not: "Pageintro"}}) {
          type
          identifier
          group
          options
    
          ...NodeCollectionFields
          ...NodeFields
          ...ImageFields
          ...YouTubeFields
        }
      }
    }
  `
}

export function Document() : string {
  return `
    fragment Document on Document {
      title
      uriPath
      meta {
        title
        description
        keywords
        noindex
        nofollow
      }
      content: children {
        type
        identifier
        group
        options
    
        ...TabbedSubpagesContentFields
        ...NodeCollectionFields
        ...NodeFields
        ...ImageFields
        ...YouTubeFields
      }
    }
  `
}

export function Home() : string {
  return `
    fragment Home on Home {
      title
      uriPath
      meta {
        title
        description
        keywords
        noindex
        nofollow
      }
      content: children {
        type
        identifier
        group
        options
    
        ...NodeCollectionFields
        ...NodeFields
        ...ImageFields
        ...YouTubeFields
      }
    }
  `
}
