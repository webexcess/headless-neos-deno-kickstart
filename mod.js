import { serve } from "https://deno.land/std@0.52.0/http/server.ts";
import { Cache } from "https://deno.land/x/dash/mod.ts";
import { Node as GQLFragmentNode, Image as GQLFragmentImage, YouTube as GQLFragmentYouTube, NodeCollection as GQLFragmentNodeCollection, TabbedSubpagesContent as GQLFragmentTabbedSubpagesContent, Document as GQLFragmentDocument, Home as GQLFragmentHome } from "./graphql/fragments.ts"
import { Components } from "./components/index.ts"

const env = Deno.env;
const port = parseInt(env.get('PORT')) || 8000
const neosHost = parseInt(env.get('NEOS_HOST')) || 'https://neos.headless-demo.neos-hosting.ch'

const s = serve({ port });
console.log("http://0.0.0.0:" + port + "/");

const cache = new Cache({
  limit: 50000,
  serialize: false,
});
const debugCache = env.get('DEBUG_CACHE') || false;

const components = new Components(neosHost);

const fragments = [
  GQLFragmentNode(),
  GQLFragmentImage(),
  GQLFragmentYouTube(),
  GQLFragmentNodeCollection(),
  GQLFragmentTabbedSubpagesContent(),
  GQLFragmentDocument(),
  GQLFragmentHome()
]

const getSubpages = async (uri = '/', language = 'de') => {
  const query = `
    query($uri: String, $language: String) {
      documents: getNodes(uri: $uri, group: {not: "meta-navigation"}, language: $language, filter: {showHiddenInIndex: false}) {
        type
        identifier
        group
        options

        ... on Document {
          title
          uriPath
          subpages: getNodes(filter: {showHiddenInIndex: false}) {
            type
            identifier
            group
            options

            ... on Document {
              title
              uriPath
              addition {
                description
                image {
                  uri
                }
              }
            }

            ... on Shortcut {
              title
              uriPath
            }
          }
        }

        ... on Shortcut {
          title
          uriPath
        }
      }
    }
  `

  const url = neosHost + "/root";
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: {uri, language} })
  };
  return await fetch(url, opts)
    .then(res => res.json())
    .then(res => {
      if (!res || !res.data || !res.data.documents) {
        return null
      }
      return res.data.documents
    })
    .catch(console.error);
}

const getDocument = async (uri = '/', language = 'de') => {
  const query = `
    ${fragments.join("\n")}

    query($uri: String, $language: String) {
      document: getNode(uri: $uri, language: $language) {
        type
        identifier
        group
        options
    
        ...Document
        ...Home
      }
    }
  `

  const url = neosHost + "/root";
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: {uri, language} })
  };
  return await fetch(url, opts)
    .then(res => res.json())
    .then(res => {
      if (!res || !res.data || !res.data.document) {
        return null
      }
      return res.data.document
    })
    .catch(console.error);
}

const mainNavigation = await getSubpages('/');
const mainNavigationHtml = mainNavigation ? '<ul><li><a href="/">Home</a></li>' + mainNavigation.map(item => `<li><a href="${item.uriPath}">${item.title}</a></li>`).join('') + '</ul>' : null

const layout = '<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>{title}</title><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" /><style>body {color: #222; background-color: #f1f1f1;} #body { margin: 0 auto; max-width: 960px; } img { max-width: 100%; } header ul { list-style: none; padding-left: 0; } header li { display: inline-block; margin-right: 1.4rem; } main { border-top: 1px solid #bbb; padding-top: 3rem; }</style></head><body>{body}</body></html>';

const tag = (tagName, content, attributes) => {
  return `<${tagName}${attributes ? ' ' + attributes : ''}>${Array.isArray(content) ? content.join('') : content}</${tagName}>`
}

for await (const req of s) {
  console.log('Requested URL ' + req.url)

  if (req.url === '/ping') {
    req.respond({
      body: layout
        .replace('{title}', 'Deno Test')
        .replace('{body}', 'It\'s alive.. go to the <a href="/">Home</a> page.')
    });

  } else {
    let cacheKey = 'page--' + req.url;
    let body = cache.get(cacheKey);

    if (!body) {
      let uriParts, subNavigation, subNavigationHtml, bodyHtml;
      uriParts = req.url.substr(1).split('/')

      if (uriParts.length > 1) {
        subNavigation = await getSubpages('/' + uriParts[0] + '/' + uriParts[1])
        subNavigationHtml = subNavigation ? '<ul>' + subNavigation.map(item => `<li><a href="${item.uriPath}">${item.title}</a></li>`).join('') + '</ul>' : null
      }

      const document = await getDocument(req.url)

      let contentElements = [];
      if (document && document.content) {
        document.content.forEach(item => {

          contentElements.push(tag('div', components.renderComponent(item.type, item)))
        });
      }
  
      body = layout
        .replace('{title}', 'Deno Test')
        .replace('{body}', tag('div', [
          tag('header', [
            mainNavigationHtml,
            (subNavigationHtml || tag('p', 'No SubNavigation'))
          ]),
          tag('main', contentElements.join(''))
        ], 'id="body"')
        )

      if (debugCache) console.log('set cache ' + cacheKey)
      cache.set(cacheKey, body)
    } else {
      if (debugCache) console.log('loaded cache ' + cacheKey)
    }

    let headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=UTF-8')

    req.respond({ headers, body });
  }
}
