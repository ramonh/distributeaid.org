## What are the next steps?

- Use the graphQL to pull useful information
- Include this information on the page
- Format it - regions and subregions and more - Link these to other pages
- build new template page in order to use it to navigate on it once we click on a region. This template will need to be
  added to the gatsby-node L.297/229 :
  - links to be like `localhost:8000/where-we-work/france` france would be the slug of the region
- Creating subpages for the regions
- would have an overview
- use data stored to describe the shipments going to or from the region - See how to link these with other regions
- images regarding the subregion

## Take over of the shift

- check out the repo `https://github.com/distributeaid/distributeaid.org`
- use branch `gmpe-hack-day`
- install Yarn and check you have node v14
- run `yarn install`
- forward the env file to the next co-host. Do not push it on the branch. rename it: `.env.development`
- run `yarn dev`
- You should be able to see: GraphQL sandbox at:
  http://localhost:8000/where-we-work
  http://localhost:8000/\_\_\_graphql
