export function paginate(items, page = 1, perPage = 10) {
  // Calculate the offset for the current page.
  const offset = perPage * (page - 1);

  // Slice the array to get the items for the current page.
  const paginatedItems = items.slice(offset, offset + perPage);

  // Calculate the total number of pages.
  const totalPages = Math.ceil(items.length / perPage);

  // Return the paginated items and the total number of pages.
  return {
    paginatedItems,
    totalPages,
  };
}
