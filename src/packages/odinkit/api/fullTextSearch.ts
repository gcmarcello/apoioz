export async function fullTextSearch({
  table,
  searchField,
  searchQuery,
  where,
  take,
}: {
  table: string[];
  searchField: string;
  searchQuery: string;
  where?: string[] | null;
  take?: number;
}) {
  const tablePath = table.map((tableName) => `"${tableName}"`).join(".");

  let whereFulltextClause =
    searchQuery === ""
      ? ""
      : `to_tsvector('english', extensions.unaccent(${tablePath}."${searchField}")) 
           @@ to_tsquery('english', extensions.unaccent($1))` + (where ? " AND " : "");

  if (where && where.length > 0) {
    const extraWhereConditions = where.map((condition) => `${condition}`).join(" AND ");
    whereFulltextClause += extraWhereConditions;
  }

  const query = `
      SELECT *
      FROM ${tablePath}
      WHERE ${whereFulltextClause}
      ORDER BY id DESC
      LIMIT $2;
    `;

  return {
    query,
    searchQuery,
    take,
  };
}
