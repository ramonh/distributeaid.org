//import DefaultLayout from '../layouts/Default'

import { graphql } from 'gatsby'
import React, { FunctionComponent, useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import TableHeader from '../components/table/TableHeader'

// Given a list of x, y, z regions in contentful
// When we navigate to the "where we work" page
// Then we should see the list of x, y, z regions displayed on the page

// Given the following regions and subregions
// | region   | subregions |
// | "France" | "Calais", "Dunkirk", "Paris" |
// | "Greece" | "Athens", "Chios", "Samos"   |
// | "British Isles" | "Scotland", "England", "Wales" |
// Then we should see the list displayed as
//  "France         Calais, Dunkirk, Paris"
//  "Greece         Athens, Chios, Samos"
//  "British Isles  Scotland, England, Wales"

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return <input type="checkbox" ref={resolvedRef} {...rest} />
  },
)

const COLUMNS = [
  {
    Header: 'Name',
    accessor: (row) => row.regionName,
  },
  {
    Header: 'Slug',
    accessor: (row) => row.regionSlug,
  },
  {
    Header: 'SubRegion Name',
    accessor: (row) => row.name,
  },
  {
    Header: 'SubRegion Slug',
    accessor: (row) => row.slug,
  },
]

interface Props {
  data: {
    allContentfulDataGeoRegion
    allContentfulDataGeoRegionSubRegion
  }
}

// [{contentfulId, name, slug, subRegionName, subRegionSlug, subRegionContentfulId]}]
const flattenToRows = (data: Props) => {
  if (!data) return []
  const {
    allContentfulDataGeoRegion: { nodes: regionNodes },
    allContentfulDataGeoRegionSubRegion: { nodes: subRegionNodes },
  } = data
  return subRegionNodes.map((subRegionNode) => {
    const matchingRegion = regionNodes.find(
      (regionNode) =>
        regionNode.contentful_id === subRegionNode.region.contentful_id,
    )

    return {
      ...subRegionNode,
      regionContentfulId: matchingRegion.contentful_id,
      regionName: matchingRegion.name,
      regionSlug: matchingRegion.slug,
    }
  })
}

const RegionPage: FunctionComponent<Props> = ({ data }) => {
  // We must memoize the data for react-table to function properly
  const region = useMemo(() => flattenToRows(data), [data])
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    state,
  } = useTable(
    { columns: COLUMNS, data: region, initialState: { hiddenColumns: [] } },
    useSortBy,
  )

  return (
    <div>
      <header>
        <h1>Regions</h1>
      </header>
      <div>
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
          All
        </div>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
      <section>
        <table>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableHeader
                    canSort={column.canSort}
                    isSorted={column.isSorted}
                    isSortedDesc={column.isSortedDesc}
                    title={column.canSort ? 'Sort rows' : ''}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                  </TableHeader>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      <footer></footer>
    </div>
  )
}

export default RegionPage

export const pageQuery = graphql`
  query RegionsWithSubRegions {
    allContentfulDataGeoRegionSubRegion {
      nodes {
        contentful_id
        name
        slug
        region {
          contentful_id
        }
      }
    }
    allContentfulDataGeoRegion {
      nodes {
        contentful_id
        name
        slug
      }
    }
  }
`
